import { type NextRequest, NextResponse } from "next/server"
import ShiprocketService, { type ShiprocketOrder } from "@/lib/shiprocket"

export async function POST(request: NextRequest) {
  try {
    console.log("📦 Shiprocket order creation request received")

    const orderData: ShiprocketOrder = await request.json()

    // Validate required fields
    if (!orderData.order_id || !orderData.billing_customer_name || !orderData.billing_email) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          details: "order_id, billing_customer_name, and billing_email are required",
        },
        { status: 400 },
      )
    }

    const result = await ShiprocketService.createOrder(orderData)

    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      data: result,
    })
  } catch (error: any) {
    console.error("❌ Shiprocket create order API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create order",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
