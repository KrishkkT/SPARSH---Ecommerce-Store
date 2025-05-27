import { type NextRequest, NextResponse } from "next/server"
import ShiprocketService from "@/lib/shiprocket"

export async function GET(request: NextRequest, { params }: { params: { shipmentId: string } }) {
  try {
    const { shipmentId } = params

    console.log(`📊 Fetching Shiprocket manifest for shipment: ${shipmentId}`)

    const result = await ShiprocketService.getManifest(shipmentId)

    return NextResponse.json({
      success: true,
      message: "Manifest fetched successfully",
      data: result,
    })
  } catch (error: any) {
    console.error("❌ Shiprocket manifest API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch manifest",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
