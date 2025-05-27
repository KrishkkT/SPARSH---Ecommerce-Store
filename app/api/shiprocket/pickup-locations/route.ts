import { type NextRequest, NextResponse } from "next/server"
import ShiprocketService from "@/lib/shiprocket"

export async function GET(request: NextRequest) {
  try {
    console.log("🏠 Fetching Shiprocket pickup locations")

    const result = await ShiprocketService.getPickupLocations()

    return NextResponse.json({
      success: true,
      message: "Pickup locations fetched successfully",
      data: result,
    })
  } catch (error: any) {
    console.error("❌ Shiprocket pickup locations API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch pickup locations",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
