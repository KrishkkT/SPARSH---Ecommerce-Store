import { type NextRequest, NextResponse } from "next/server"
import ShiprocketService, { type ShiprocketAWBRequest } from "@/lib/shiprocket"

export async function POST(request: NextRequest) {
  try {
    console.log("📮 Shiprocket AWB assignment request received")

    const awbData: ShiprocketAWBRequest = await request.json()

    // Validate required fields
    if (!awbData.shipment_id || !awbData.courier_id) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          details: "shipment_id and courier_id are required",
        },
        { status: 400 },
      )
    }

    const result = await ShiprocketService.assignAWB(awbData)

    return NextResponse.json({
      success: true,
      message: "AWB assigned successfully",
      data: result,
    })
  } catch (error: any) {
    console.error("❌ Shiprocket AWB assignment API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to assign AWB",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
