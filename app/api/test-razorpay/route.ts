import { type NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"

export async function GET() {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  })

  try {
    const order = await razorpay.orders.create({
      amount: 1,
      currency: "INR",
      receipt: "test_rcpt_" + Date.now(),
    })

    return NextResponse.json({ success: true, order })
  } catch (error: any) {
    console.error("Razorpay SDK error:", error)
    return NextResponse.json(
      { success: false, error: error.message, raw: error },
      { status: 500 }
    )
  }
}

/*export async function GET(request: NextRequest) {
  try {
    // Check environment variables - only use server-side variables
    const keyId = process.env.RAZORPAY_KEY_ID!
    const keySecret = process.env.RAZORPAY_KEY_SECRET!

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
}*/
