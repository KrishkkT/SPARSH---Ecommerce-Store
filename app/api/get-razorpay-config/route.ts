import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Only use the server-side Razorpay key ID (not the NEXT_PUBLIC_ version)
    const keyId = process.env.RAZORPAY_KEY_ID

    if (!keyId) {
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
      keyId: keyId,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get Razorpay configuration",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
