import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { getSupabaseClient } from "@/lib/supabase-client"
import { EnhancedEmailService } from "@/components/enhanced-email-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = body

    console.log("🔐 Verifying payment:", {
      razorpay_order_id,
      razorpay_payment_id,
      order_id,
    })

    // Verify signature
    const secret = process.env.RAZORPAY_KEY_SECRET
    if (!secret) {
      throw new Error("Razorpay secret key not configured")
    }

    const body_string = razorpay_order_id + "|" + razorpay_payment_id
    const expected_signature = crypto.createHmac("sha256", secret).update(body_string).digest("hex")

    if (expected_signature !== razorpay_signature) {
      console.error("❌ Payment signature verification failed")
      return NextResponse.json({ success: false, error: "Payment verification failed" }, { status: 400 })
    }

    console.log("✅ Payment signature verified")

    const supabase = getSupabaseClient()

    // Update order status
    const { data: order, error: updateError } = await supabase
      .from("orders")
      .update({
        payment_status: "completed",
        status: "confirmed",
        payment_id: razorpay_payment_id,
        razorpay_payment_id: razorpay_payment_id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", order_id)
      .select(`
        *,
        order_items (*)
      `)
      .single()

    if (updateError || !order) {
      console.error("❌ Failed to update order:", updateError)
      throw new Error("Failed to update order status")
    }

    console.log("✅ Order updated successfully")

    // Generate invoice after successful payment
    try {
      const invoiceResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/orders/${order_id}/invoice`, {
        method: "GET",
      })

      if (invoiceResponse.ok) {
        console.log("✅ Invoice generated successfully")
      } else {
        console.warn("⚠️ Invoice generation failed, will be available later")
      }
    } catch (invoiceError) {
      console.warn("⚠️ Invoice generation error:", invoiceError)
    }

    // Send enhanced order confirmation email
    try {
      const orderDetails = {
        order_id: order.id,
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        customer_phone: order.customer_phone,
        shipping_address: order.shipping_address,
        total_amount: order.total_amount,
        payment_method: order.payment_method || "Razorpay",
        payment_id: razorpay_payment_id,
        order_date: order.created_at,
        invoice_url: order.invoice_url,
        order_items: order.order_items?.map((item: any) => ({
          product_name: item.product_name,
          quantity: item.quantity,
          product_price: item.product_price,
          subtotal: item.product_price * item.quantity,
        })),
      }

      const emailResult = await EnhancedEmailService.sendOrderConfirmation(orderDetails)

      if (emailResult.success) {
        console.log("✅ Order confirmation email sent successfully")
      } else {
        console.error("❌ Failed to send order confirmation email:", emailResult.customerEmail?.error)
      }
    } catch (emailError) {
      console.error("❌ Email sending error:", emailError)
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified and order confirmed",
      order_id: order.id,
    })
  } catch (error: any) {
    console.error("❌ Payment verification error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Payment verification failed",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
