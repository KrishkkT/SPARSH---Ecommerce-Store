import { type NextRequest, NextResponse } from "next/server"
import ShiprocketService from "@/lib/shiprocket"

export async function GET(request: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    const { orderId } = params

    console.log(`📋 Fetching Shiprocket order details for: ${orderId}`)

    const result = await ShiprocketService.getOrderDetails(orderId)

    return NextResponse.json({
      success: true,
      message: "Order details fetched successfully",
      data: result,
    })
  } catch (error: any) {
    console.error("❌ Shiprocket get order details API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch order details",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
