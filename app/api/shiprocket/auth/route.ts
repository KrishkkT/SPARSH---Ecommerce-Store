import { type NextRequest, NextResponse } from "next/server"
import ShiprocketService from "@/lib/shiprocket"

export async function POST(request: NextRequest) {
  try {
    console.log("🔐 Shiprocket authentication request received")

    const token = await ShiprocketService.authenticate()

    return NextResponse.json({
      success: true,
      message: "Authentication successful",
      token: token.substring(0, 10) + "...", // Only show first 10 chars for security
    })
  } catch (error: any) {
    console.error("❌ Shiprocket auth API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Authentication failed",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = await ShiprocketService.authenticate()

    return NextResponse.json({
      success: true,
      authenticated: !!token,
      message: "Authentication status checked",
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        authenticated: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}
