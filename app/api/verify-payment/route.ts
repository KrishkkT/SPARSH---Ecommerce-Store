import { type NextRequest, NextResponse } from "next/server"
import { verifyRazorpayPayment } from "@/lib/razorpay"
import { getSupabaseClient } from "@/lib/supabase-client"
import { EmailService } from "@/components/email-service"
import { generateInvoicePDF } from "@/lib/invoice-generator"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !order_id) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 },
      )
    }

    // Verify payment signature
    const isValid = verifyRazorpayPayment({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    })

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid payment signature",
        },
        { status: 400 },
      )
    }

    // Update order in database
    const supabase = getSupabaseClient()

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .update({
        status: "confirmed",
        payment_status: "completed",
        razorpay_payment_id,
        razorpay_signature,
        updated_at: new Date().toISOString(),
      })
      .eq("id", order_id)
      .select(`
        *,
        order_items (*)
      `)
      .single()

    if (orderError) {
      console.error("Order update error:", orderError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to update order in database",
        },
        { status: 500 },
      )
    }

    // Generate invoice PDF
    try {
      const pdfBuffer = await generateInvoicePDF(order)

      // Upload to Supabase storage
      const fileName = `invoices/invoice-${order.id}-${Date.now()}.pdf`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("invoices")
        .upload(fileName, pdfBuffer, {
          contentType: "application/pdf",
          cacheControl: "3600",
        })

      if (uploadError) {
        console.error("Invoice upload error:", uploadError)
      } else {
        // Get public URL
        const { data: urlData } = supabase.storage.from("invoices").getPublicUrl(fileName)

        if (urlData?.publicUrl) {
          // Update order with invoice URL
          await supabase.from("orders").update({ invoice_url: urlData.publicUrl }).eq("id", order.id)

          // Add invoice URL to order object for email
          order.invoice_url = urlData.publicUrl
        }
      }
    } catch (invoiceError) {
      console.error("Invoice generation error:", invoiceError)
      // Don't fail the payment verification if invoice generation fails
    }

    // Send order confirmation email
    try {
      await EmailService.sendOrderConfirmation({
        order_id: order.id,
        order_date: order.created_at,
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        customer_phone: order.customer_phone,
        shipping_address: order.shipping_address,
        payment_method: order.payment_method,
        payment_id: razorpay_payment_id,
        total_amount: order.total_amount,
        order_items: order.order_items,
        invoice_url: order.invoice_url,
      })
    } catch (emailError) {
      console.error("Order confirmation email error:", emailError)
      // Don't fail the payment verification if email fails
    }

    return NextResponse.json({
      success: true,
      order,
    })
  } catch (error: any) {
    console.error("Verify payment error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to verify payment",
      },
      { status: 500 },
    )
  }
}
