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

    // Check if invoice already exists
    if (order.invoice_url) {
      console.log("📄 Invoice already exists, fetching from storage")
      try {
        const response = await fetch(order.invoice_url)
        if (response.ok) {
          const buffer = await response.arrayBuffer()
          return new NextResponse(buffer, {
            headers: {
              "Content-Type": "application/pdf",
              "Content-Disposition": `attachment; filename="SPARSH-Invoice-${orderId.slice(0, 8)}.pdf"`,
              "Cache-Control": "public, max-age=3600",
            },
          })
        }
      } catch (error) {
        console.warn("⚠️ Failed to fetch existing invoice, generating new one")
      }
    }

    // Generate new invoice
    console.log("📄 Generating new invoice PDF")
    const pdfBuffer = await generateInvoicePDF(order)

    // Upload to Supabase storage
    const fileName = `invoices/invoice-${orderId}-${Date.now()}.pdf`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("invoices")
      .upload(fileName, pdfBuffer, {
        contentType: "application/pdf",
        cacheControl: "3600",
      })

    if (uploadError) {
      console.error("❌ Failed to upload invoice:", uploadError)
    } else {
      // Get public URL
      const { data: urlData } = supabase.storage.from("invoices").getPublicUrl(fileName)

      if (urlData?.publicUrl) {
        // Update order with invoice URL
        await supabase.from("orders").update({ invoice_url: urlData.publicUrl }).eq("id", orderId)

        console.log("✅ Invoice uploaded and order updated")
      }
    }

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="SPARSH-Invoice-${orderId.slice(0, 8)}.pdf"`,
        "Cache-Control": "public, max-age=3600",
      },
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
