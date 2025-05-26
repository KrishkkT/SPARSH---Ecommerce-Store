import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Check environment variables - only use server-side variables
    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    const config = {
      hasKeyId: !!keyId,
      hasKeySecret: !!keySecret,
      keyIdLength: keyId ? keyId.length : 0,
      keySecretLength: keySecret ? keySecret.length : 0,
      keyIdPrefix: keyId ? keyId.substring(0, 8) + "..." : "missing",
    }

    return NextResponse.json({
      success: true,
      message: "Razorpay configuration check",
      config,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Configuration check failed",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
