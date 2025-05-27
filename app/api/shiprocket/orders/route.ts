import { type NextRequest, NextResponse } from "next/server"
import ShiprocketService from "@/lib/shiprocket"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const per_page = Number.parseInt(searchParams.get("per_page") || "10")

    console.log(`📋 Fetching Shiprocket orders - Page: ${page}, Per Page: ${per_page}`)

    const result = await ShiprocketService.getOrders(page, per_page)

    return NextResponse.json({
      success: true,
      message: "Orders fetched successfully",
      data: result,
    })
  } catch (error: any) {
    console.error("❌ Shiprocket get orders API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch orders",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
