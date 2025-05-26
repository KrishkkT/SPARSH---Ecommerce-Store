import { type NextRequest, NextResponse } from "next/server"
import { createRefund } from "@/lib/razorpay"

// POST /api/razorpay/refunds - Create a refund
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { payment_id, amount, notes } = body

    if (!payment_id) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment ID is required",
        },
        { status: 400 },
      )
    }

    const result = await createRefund(
      payment_id,
      amount ? Math.round(amount * 100) : undefined, // Convert to paise if provided
      notes,
    )

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      refund: result.refund,
    })
  } catch (error: any) {
    console.error("Create refund error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create refund",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
