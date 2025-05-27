import { type NextRequest, NextResponse } from "next/server"
import ShiprocketService, { type ShiprocketServiceabilityRequest } from "@/lib/shiprocket"

export async function POST(request: NextRequest) {
  try {
    console.log("📮 Shiprocket serviceability check request received")

    const serviceabilityData: ShiprocketServiceabilityRequest = await request.json()

    // Validate required fields
    if (!serviceabilityData.pickup_postcode || !serviceabilityData.delivery_postcode) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          details: "pickup_postcode and delivery_postcode are required",
        },
        { status: 400 },
      )
    }

    const result = await ShiprocketService.checkServiceability(serviceabilityData)

    return NextResponse.json({
      success: true,
      message: "Serviceability checked successfully",
      data: result,
    })
  } catch (error: any) {
    console.error("❌ Shiprocket serviceability API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to check serviceability",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
