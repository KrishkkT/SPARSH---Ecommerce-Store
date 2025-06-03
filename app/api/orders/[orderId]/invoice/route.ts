import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase-client"
import { generateInvoicePDF } from "@/lib/invoice-generator"

export async function GET(request: NextRequest, { params }: { params: { orderId: string } }) {
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

    // Generate new invoice every time to ensure fresh data
    console.log("📄 Generating fresh invoice PDF")
    const { buffer } = await generateInvoicePDF(order)

    // Set proper headers for PDF download
    const headers = new Headers()
    headers.set("Content-Type", "application/pdf")
    headers.set("Content-Disposition", `attachment; filename="SPARSH-Invoice-${orderId.slice(0, 8)}.pdf"`)
    headers.set("Cache-Control", "no-cache, no-store, must-revalidate")
    headers.set("Pragma", "no-cache")
    headers.set("Expires", "0")
    headers.set("Content-Length", buffer.length.toString())

    // Upload to Supabase storage for future reference (optional)
    try {
      const fileName = `invoices/invoice-${orderId}-${Date.now()}.pdf`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("invoices")
        .upload(fileName, buffer, {
          contentType: "application/pdf",
          cacheControl: "3600",
          upsert: true,
        })

      if (!uploadError && uploadData) {
        // Get public URL
        const { data: urlData } = supabase.storage.from("invoices").getPublicUrl(fileName)

        if (urlData?.publicUrl) {
          // Update order with invoice URL
          await supabase.from("orders").update({ invoice_url: urlData.publicUrl }).eq("id", orderId)
          console.log("✅ Invoice uploaded and order updated with URL:", urlData.publicUrl)
        }
      }
    } catch (uploadError) {
      console.warn("⚠️ Failed to upload invoice to storage, but continuing with download:", uploadError)
    }

    return new NextResponse(buffer, { headers })
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
