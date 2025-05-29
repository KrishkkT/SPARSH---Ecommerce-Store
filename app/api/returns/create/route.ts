import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase-client"
import { EmailService } from "@/components/email-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      orderId,
      reason,
      items,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      additionalNotes,
      photoUrls,
      refundPercentage,
      refundAmount,
      returnReasonDetails,
    } = body

    // Validate required fields
    if (!orderId || !reason || !customerName || !customerEmail || !customerPhone || !customerAddress) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 },
      )
    }

    const supabase = getSupabaseClient()

    // Verify the order exists and belongs to the user
    const { data: order, error: orderError } = await supabase.from("orders").select("*").eq("id", orderId).single()

    if (orderError || !order) {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found",
        },
        { status: 404 },
      )
    }

    // Check if order is eligible for return (within 48 hours)
    const orderDate = new Date(order.created_at)
    const now = new Date()
    const hoursDiff = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60)

    if (hoursDiff > 48) {
      return NextResponse.json(
        {
          success: false,
          error: "Return window has expired. Returns must be initiated within 48 hours of delivery.",
        },
        { status: 400 },
      )
    }

    // Create return request record
    const { data: returnRequest, error: returnError } = await supabase
      .from("return_requests")
      .insert({
        order_id: orderId,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        customer_address: customerAddress,
        return_reason: reason,
        items: items,
        additional_notes: additionalNotes,
        photo_urls: photoUrls || [],
        refund_percentage: refundPercentage,
        expected_refund_amount: refundAmount,
        status: "pending",
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (returnError) {
      console.error("Return request creation error:", returnError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to create return request",
        },
        { status: 500 },
      )
    }

    // Send email notifications
    try {
      const emailResult = await EmailService.sendReturnRequest({
        orderId,
        reason,
        items,
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
        refundAmount,
        refundPercentage,
        photoUrls,
      })

      console.log("📧 Return request emails sent:", emailResult)
    } catch (emailError) {
      console.error("📧 Failed to send return request emails:", emailError)
      // Don't fail the return request if email fails
    }

    return NextResponse.json({
      success: true,
      returnRequest,
      message: "Return request submitted successfully",
    })
  } catch (error: any) {
    console.error("Return request error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process return request",
      },
      { status: 500 },
    )
  }
}
