import { type NextRequest, NextResponse } from "next/server"
import ShiprocketService from "@/lib/shiprocket"

export async function POST(request: NextRequest) {
  try {
    console.log("🔄 Shiprocket RTO cancellation request received")

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

    const result = await ShiprocketService.cancelRTO(orderIds)

    return NextResponse.json({
      success: true,
      message: "RTO cancelled successfully",
      data: result,
    })
  } catch (error: any) {
    console.error("❌ Shiprocket RTO cancellation API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to cancel RTO",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
