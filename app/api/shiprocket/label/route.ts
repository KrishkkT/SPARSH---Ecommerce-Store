import { type NextRequest, NextResponse } from "next/server"
import ShiprocketService, { type ShiprocketLabelRequest } from "@/lib/shiprocket"

export async function POST(request: NextRequest) {
  try {
    console.log("🏷️ Shiprocket label generation request received")

    const labelData: ShiprocketLabelRequest = await request.json()

    // Validate required fields
    if (!labelData.shipment_id || !Array.isArray(labelData.shipment_id) || labelData.shipment_id.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid shipment IDs",
          details: "shipment_id must be a non-empty array",
        },
        { status: 400 },
      )
    }

    const result = await ShiprocketService.generateLabel(labelData)

    return NextResponse.json({
      success: true,
      message: "Label generated successfully",
      data: result,
    })
  } catch (error: any) {
    console.error("❌ Shiprocket label generation API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate label",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
