import { type NextRequest, NextResponse } from "next/server"
import ShiprocketService from "@/lib/shiprocket"

export async function GET(request: NextRequest) {
  try {
    console.log("📊 Fetching Shiprocket account details")

    const result = await ShiprocketService.getAccountDetails()

    return NextResponse.json({
      success: true,
      message: "Account details fetched successfully",
      data: result,
    })
  } catch (error: any) {
    console.error("❌ Shiprocket account details API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch account details",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
