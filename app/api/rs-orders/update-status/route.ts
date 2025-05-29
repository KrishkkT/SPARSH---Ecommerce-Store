import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase-client"

export async function POST(request: NextRequest) {
  try {
    const { orderId, status } = await request.json()

    // Validate required fields
    if (!orderId || !status) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Validate status
    const validStatuses = ["shipped", "delivered", "cancelled"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 })
    }

    const supabase = getSupabaseClient()

    // Check if order exists and is confirmed
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, status, payment_status")
      .eq("id", orderId)
      .eq("status", "confirmed")
      .eq("payment_status", "completed")
      .single()

    if (orderError || !order) {
      return NextResponse.json(
        { success: false, error: "Order not found or not eligible for status update" },
        { status: 404 },
      )
    }

    // Update order status
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)

    if (updateError) {
      console.error("Order status update error:", updateError)
      return NextResponse.json({ success: false, error: "Failed to update order status" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Order status updated to ${status} successfully`,
    })
  } catch (error: any) {
    console.error("Order status update error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update order status",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
