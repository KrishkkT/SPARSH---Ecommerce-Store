import { type NextRequest, NextResponse } from "next/server"
import ShiprocketService from "@/lib/shiprocket"

export async function POST(request: NextRequest) {
  try {
    console.log("❌ Shiprocket order cancellation request received")

    const { orderIds } = await request.json()

    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid order IDs",
          details: "orderIds must be a non-empty array",
        },
        { status: 400 },
      )
    }

    const result = await ShiprocketService.cancelOrder(orderIds)

    return NextResponse.json({
      success: true,
      message: "Orders cancelled successfully",
      data: result,
    })
  } catch (error: any) {
    console.error("❌ Shiprocket cancel order API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to cancel orders",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
