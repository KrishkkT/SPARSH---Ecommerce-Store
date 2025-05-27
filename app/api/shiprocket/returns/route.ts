import { type NextRequest, NextResponse } from "next/server"
import ShiprocketService, { type ShiprocketReturnRequest } from "@/lib/shiprocket"

export async function POST(request: NextRequest) {
  try {
    console.log("🔄 Shiprocket return creation request received")

    const returnData: ShiprocketReturnRequest = await request.json()

    // Validate required fields
    if (!returnData.order_id || !returnData.pickup_customer_name || !returnData.shipping_customer_name) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          details: "order_id, pickup_customer_name, and shipping_customer_name are required",
        },
        { status: 400 },
      )
    }

    const result = await ShiprocketService.createReturn(returnData)

    return NextResponse.json({
      success: true,
      message: "Return created successfully",
      data: result,
    })
  } catch (error: any) {
    console.error("❌ Shiprocket return creation API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create return",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
