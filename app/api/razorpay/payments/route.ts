import { type NextRequest, NextResponse } from "next/server"
import { listPayments } from "@/lib/razorpay"

// GET /api/razorpay/payments - List all payments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const count = Number.parseInt(searchParams.get("count") || "10")
    const skip = Number.parseInt(searchParams.get("skip") || "0")

    const result = await listPayments(count, skip)

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
      payments: result.payments,
    })
  } catch (error: any) {
    console.error("List payments error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to list payments",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
