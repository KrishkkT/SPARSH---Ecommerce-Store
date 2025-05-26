import { type NextRequest, NextResponse } from "next/server"
import { fetchPaymentDetails } from "@/lib/razorpay"

// GET /api/razorpay/payments/[paymentId] - Fetch specific payment details
export async function GET(request: NextRequest, { params }: { params: { paymentId: string } }) {
  try {
    const { paymentId } = params

    if (!paymentId) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment ID is required",
        },
        { status: 400 },
      )
    }

    const result = await fetchPaymentDetails(paymentId)

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
      payment: result.payment,
    })
  } catch (error: any) {
    console.error("Fetch payment details error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch payment details",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
