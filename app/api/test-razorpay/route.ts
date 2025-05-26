import { type NextRequest, NextResponse } from "next/server"
import { createRazorpayOrder, fetchOrderDetails, listOrders } from "@/lib/razorpay"

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    if (!keyId || !keySecret) {
      return NextResponse.json(
        {
          success: false,
          error: "Razorpay credentials not configured",
        },
        { status: 500 },
      )
    }

    // Test creating an order
    console.log("Testing Razorpay order creation...")
    const testOrderResult = await createRazorpayOrder({
      amount: 100, // ₹1.00 in paise
      currency: "INR",
      receipt: `test_${Date.now()}`,
      notes: {
        test: "true",
        environment: "development",
      },
    })

    if (!testOrderResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to create test order",
          details: testOrderResult.error,
        },
        { status: 500 },
      )
    }

    // Test fetching the created order
    console.log("Testing order fetch...")
    const fetchResult = await fetchOrderDetails(testOrderResult.order.id)

    // Test listing orders
    console.log("Testing orders list...")
    const listResult = await listOrders(5, 0)

    const config = {
      hasKeyId: !!keyId,
      hasKeySecret: !!keySecret,
      keyIdLength: keyId.length,
      keySecretLength: keySecret.length,
      keyIdPrefix: keyId.substring(0, 8) + "...",
      testOrder: testOrderResult.order,
      fetchedOrder: fetchResult.success ? fetchResult.order : null,
      ordersList: listResult.success ? listResult.orders : null,
    }

    return NextResponse.json({
      success: true,
      message: "Razorpay API test completed successfully",
      config,
    })
  } catch (error: any) {
    console.error("Razorpay test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Razorpay test failed",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency = "INR", receipt, notes } = body

    if (!amount || !receipt) {
      return NextResponse.json(
        {
          success: false,
          error: "Amount and receipt are required",
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
    console.error("Test order creation error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create test order",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
