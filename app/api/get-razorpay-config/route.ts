import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("🔑 Getting Razorpay configuration...")

    // Get key ID from environment
    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID

    console.log("Environment check:", {
      keyId: keyId ? `${keyId.substring(0, 12)}...` : "MISSING",
      nodeEnv: process.env.NODE_ENV,
      allRazorpayKeys: Object.keys(process.env).filter((key) => key.includes("RAZORPAY")),
    })

    if (!keyId) {
      console.error("❌ RAZORPAY_KEY_ID not found in environment variables")
      console.error(
        "Available env vars:",
        Object.keys(process.env).filter((key) => key.includes("RAZORPAY")),
      )

      return NextResponse.json(
        {
          success: false,
          error: "Razorpay configuration not found",
          details: "RAZORPAY_KEY_ID environment variable is missing",
        },
        { status: 500 },
      )
    }

    console.log("✅ Razorpay key found:", {
      keyId: `${keyId.substring(0, 12)}...`,
      keyType: keyId.startsWith("rzp_live_") ? "LIVE" : "TEST",
    })

    return NextResponse.json({
      success: true,
      keyId: keyId,
      keyType: keyId.startsWith("rzp_live_") ? "LIVE" : "TEST",
    })
  } catch (error: any) {
    console.error("❌ Error getting Razorpay config:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Configuration error",
        details: error.message || "Failed to get Razorpay configuration",
      },
      { status: 500 },
    )
  }
}
