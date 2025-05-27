import { type NextRequest, NextResponse } from "next/server"
import ShiprocketService from "@/lib/shiprocket"

export async function GET(request: NextRequest) {
  try {
    console.log("📊 Fetching Shiprocket channels")

    const result = await ShiprocketService.getChannels()

    return NextResponse.json({
      success: true,
      message: "Channels fetched successfully",
      data: result,
    })
  } catch (error: any) {
    console.error("❌ Shiprocket channels API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch channels",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
