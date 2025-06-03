import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase-client"
import { generateInvoicePDF } from "@/lib/invoice-generator"

export async function POST(request: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    const { orderId } = params

    console.log("📄 Generating invoice for order:", orderId)

    const supabase = getSupabaseClient()

    // Fetch order details with items
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (*)
      `)
      .eq("id", orderId)
      .single()

    if (orderError || !order) {
      console.error("❌ Order not found:", orderError)
      return NextResponse.json(
        {
          success: false,
          error: "Order not found",
        },
        { status: 404 },
      )
    }

    // Check if order is eligible for invoice (completed payment)
    if (order.payment_status !== "completed") {
      return NextResponse.json(
        {
          success: false,
          error: "Invoice not available for this order",
        },
        { status: 400 },
      )
    }

    // Generate new invoice
    console.log("📄 Generating new invoice PDF")
    const { buffer, base64 } = await generateInvoicePDF(order)

    // Upload to Supabase storage
    const fileName = `invoices/invoice-${orderId}-${Date.now()}.pdf`
    const { data: uploadData, error: uploadError } = await supabase.storage.from("invoices").upload(fileName, buffer, {
      contentType: "application/pdf",
      cacheControl: "3600",
    })

    if (uploadError) {
      console.error("❌ Failed to upload invoice:", uploadError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to upload invoice to storage",
          details: uploadError.message,
        },
        { status: 500 },
      )
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from("invoices").getPublicUrl(fileName)

    if (!urlData?.publicUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to get public URL for invoice",
        },
        { status: 500 },
      )
    }

    // Update order with invoice URL
    const { error: updateError } = await supabase
      .from("orders")
      .update({ invoice_url: urlData.publicUrl })
      .eq("id", orderId)

    if (updateError) {
      console.error("❌ Failed to update order with invoice URL:", updateError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to update order with invoice URL",
          details: updateError.message,
        },
        { status: 500 },
      )
    }

    console.log("✅ Invoice generated and stored successfully:", urlData.publicUrl)

    return NextResponse.json({
      success: true,
      invoiceUrl: urlData.publicUrl,
      message: "Invoice generated successfully",
    })
  } catch (error: any) {
    console.error("❌ Invoice generation error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate invoice",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
