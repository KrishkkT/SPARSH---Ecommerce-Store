import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase-client"
import { EmailService } from "@/components/email-service"

export async function POST(request: NextRequest) {
  try {
    const returnData = await request.json()

    // Validate required fields
    if (
      !returnData.orderId ||
      !returnData.reason ||
      !returnData.customerName ||
      !returnData.customerEmail ||
      !returnData.customerPhone
    ) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const supabase = getSupabaseClient()

    // Get user from session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    // Verify order belongs to user and is eligible for return
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", returnData.orderId)
      .eq("user_id", user.id)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ success: false, error: "Order not found or not eligible for return" }, { status: 404 })
    }

    // Check if order is within return window (2 days)
    const orderDate = new Date(order.created_at)
    const now = new Date()
    const hoursDiff = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60)

    if (hoursDiff > 48) {
      return NextResponse.json(
        {
          success: false,
          error: "Return window has expired. Returns must be initiated within 2 days of delivery.",
        },
        { status: 400 },
      )
    }

    // Create return request
    const { data: returnRequest, error: returnError } = await supabase
      .from("returns")
      .insert({
        order_id: returnData.orderId,
        user_id: user.id,
        customer_name: returnData.customerName,
        customer_email: returnData.customerEmail,
        customer_phone: returnData.customerPhone,
        customer_address: returnData.customerAddress || "",
        return_reason: returnData.reason,
        return_items: returnData.items || "",
        photo_urls: returnData.photoUrls || [],
        refund_percentage: returnData.refundPercentage || 60,
        refund_amount: returnData.refundAmount || 0,
        status: "pending",
      })
      .select()
      .single()

    if (returnError) {
      console.error("Return creation error:", returnError)
      return NextResponse.json({ success: false, error: "Failed to create return request" }, { status: 500 })
    }

    // Send emails (customer confirmation + admin notification)
    const emailResult = await EmailService.sendReturnRequest({
      orderId: returnData.orderId,
      reason: returnData.returnReasonDetails?.label || returnData.reason,
      items: returnData.items || "",
      customerName: returnData.customerName,
      customerEmail: returnData.customerEmail,
      customerPhone: returnData.customerPhone,
      customerAddress: returnData.customerAddress || "",
      refundAmount: returnData.refundAmount || 0,
      refundPercentage: returnData.refundPercentage || 60,
      photoUrls: returnData.photoUrls || [],
    })

    // If this is a damage/defect claim, potentially trigger automatic refund
    if (returnData.reason === "damaged_shipping" || returnData.reason === "defective_product") {
      // Here you could integrate with Razorpay to initiate automatic refund
      // For now, we'll just mark it for admin review
      await supabase
        .from("returns")
        .update({ admin_notes: "High priority - damage/defect claim with photos" })
        .eq("id", returnRequest.id)
    }

    return NextResponse.json({
      success: true,
      message: "Return request submitted successfully",
      returnId: returnRequest.id,
      emailResult,
    })
  } catch (error: any) {
    console.error("Return request error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process return request",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
