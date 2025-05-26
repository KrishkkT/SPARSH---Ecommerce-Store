import { type NextRequest, NextResponse } from "next/server"
import { createRazorpayOrder, listOrders } from "@/lib/razorpay"

// GET /api/razorpay/orders - List all orders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const count = Number.parseInt(searchParams.get("count") || "10")
    const skip = Number.parseInt(searchParams.get("skip") || "0")

    const result = await listOrders(count, skip)

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
      orders: result.orders,
    })
  } catch (error: any) {
    console.error("List orders error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to list orders",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

// POST /api/razorpay/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency = "INR", receipt, notes } = body

    // Validation
    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid amount",
          details: "Amount must be a positive number",
        },
        { status: 400 },
      )
    }

    if (!receipt || typeof receipt !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid receipt",
          details: "Receipt must be a non-empty string",
        },
        { status: 400 },
      )
    }

    const result = await createRazorpayOrder({
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt,
      notes,
    })

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
    console.error("Create order error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create order",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
