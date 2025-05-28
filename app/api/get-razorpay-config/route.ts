import { NextResponse } from "next/server"

export async function GET() {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID

    console.log("🔑 Razorpay config request:", {
      keyId: keyId ? `${keyId.substring(0, 12)}...` : "MISSING",
      nodeEnv: process.env.NODE_ENV,
    })

    if (!keyId) {
      console.error("❌ RAZORPAY_KEY_ID environment variable is missing")
      return NextResponse.json(
        {
          success: false,
          error: "Razorpay configuration not found",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      keyId,
    })
  } catch (error: any) {
    console.error("❌ Get Razorpay config error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get Razorpay configuration",
      },
      { status: 500 },
    )
  }
}
