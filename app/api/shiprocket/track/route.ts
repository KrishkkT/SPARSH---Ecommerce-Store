import { type NextRequest, NextResponse } from "next/server"
import ShiprocketService from "@/lib/shiprocket"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("order_id")

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing order ID",
          details: "order_id parameter is required",
        },
        { status: 400 },
      )
    }

    console.log(`📍 Tracking Shiprocket order: ${orderId}`)

    const result = await ShiprocketService.trackOrder(orderId)

    return NextResponse.json({
      success: true,
      message: "Order tracking fetched successfully",
      data: result,
    })
  } catch (error: any) {
    console.error("❌ Shiprocket tracking API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to track order",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
