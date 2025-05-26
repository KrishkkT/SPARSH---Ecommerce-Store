import { type NextRequest, NextResponse } from "next/server"
import { fetchOrderDetails } from "@/lib/razorpay"

// GET /api/razorpay/orders/[orderId] - Fetch specific order details
export async function GET(request: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    const { orderId } = params

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          error: "Order ID is required",
        },
        { status: 400 },
      )
    }

    const result = await fetchOrderDetails(orderId)

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
      order: result.order,
    })
  } catch (error: any) {
    console.error("Fetch order details error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch order details",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
