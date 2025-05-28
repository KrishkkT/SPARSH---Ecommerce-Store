import { type NextRequest, NextResponse } from "next/server"
import { createRazorpayOrder } from "@/lib/razorpay"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 Starting order creation process...")

    // Parse JSON with proper error handling
    let body
    try {
      const requestText = await request.text()
      console.log("📝 Request body length:", requestText.length)

      if (!requestText) {
        console.error("❌ Empty request body")
        return NextResponse.json(
          {
            success: false,
            error: "Empty request body",
            details: "Request body cannot be empty",
          },
          { status: 400 },
        )
      }
      body = JSON.parse(requestText)
      console.log("✅ Request parsed successfully")
    } catch (parseError) {
      console.error("❌ JSON parsing error:", parseError)
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON format",
          details: "Request body must contain valid JSON",
        },
        { status: 400 },
      )
    }

    const { amount, currency = "INR", receipt, userId, orderData } = body

    console.log("📋 Received order request:", {
      amount: typeof amount,
      amountValue: amount,
      currency,
      receipt: typeof receipt,
      receiptValue: receipt,
      receiptLength: receipt?.length,
      userId: typeof userId,
      hasOrderData: !!orderData,
    })

    // Comprehensive validation
    if (!amount || typeof amount !== "number" || amount <= 0) {
      console.error("❌ Invalid amount:", amount)
      return NextResponse.json(
        {
          success: false,
          error: "Invalid amount",
          details: "Amount must be a positive number",
        },
        { status: 400 },
      )
    }

    if (!receipt || typeof receipt !== "string" || receipt.length === 0) {
      console.error("❌ Invalid receipt:", receipt)
      return NextResponse.json(
        {
          success: false,
          error: "Invalid receipt",
          details: "Receipt must be a non-empty string",
        },
        { status: 400 },
      )
    }

    if (receipt.length > 40) {
      console.error("❌ Receipt too long:", receipt, "Length:", receipt.length)
      return NextResponse.json(
        {
          success: false,
          error: "Invalid receipt length",
          details: "Receipt must be 40 characters or less",
        },
        { status: 400 },
      )
    }

    if (!userId || typeof userId !== "string") {
      console.error("❌ Invalid userId:", userId)
      return NextResponse.json(
        {
          success: false,
          error: "Invalid userId",
          details: "UserId must be a non-empty string",
        },
        { status: 400 },
      )
    }

    if (!orderData || typeof orderData !== "object") {
      console.error("❌ Missing order data:", orderData)
      return NextResponse.json(
        {
          success: false,
          error: "Missing order data",
          details: "Order data object is required",
        },
        { status: 400 },
      )
    }

    // Validate order data fields
    const requiredOrderFields = ["customerName", "customerEmail", "customerPhone", "shippingAddress"]
    for (const field of requiredOrderFields) {
      if (!orderData[field] || typeof orderData[field] !== "string" || orderData[field].trim() === "") {
        console.error(`❌ Missing or invalid ${field}:`, orderData[field])
        return NextResponse.json(
          {
            success: false,
            error: `Missing or invalid ${field}`,
            details: `${field} is required and must be a non-empty string`,
          },
          { status: 400 },
        )
      }
    }

    // Validate items array
    if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      console.error("❌ Invalid items:", orderData.items)
      return NextResponse.json(
        {
          success: false,
          error: "Invalid items",
          details: "Items array is required and must not be empty",
        },
        { status: 400 },
      )
    }

    // Create Razorpay order
    console.log("💳 Creating Razorpay order with:", {
      amount: Math.round(amount * 100),
      currency,
      receipt,
      receiptLength: receipt.length,
    })

    const razorpayResult = await createRazorpayOrder({
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt,
      notes: {
        userId: userId.substring(0, 30), // Limit note length
        customerName: orderData.customerName.substring(0, 30),
        customerEmail: orderData.customerEmail.substring(0, 30),
      },
    })

    console.log("💳 Razorpay result:", {
      success: razorpayResult.success,
      hasOrder: !!razorpayResult.order,
      orderId: razorpayResult.order?.id,
      error: razorpayResult.error,
    })

    if (!razorpayResult.success) {
      console.error("❌ Razorpay order creation failed:", razorpayResult.error)
      return NextResponse.json(
        {
          success: false,
          error: "Payment gateway error",
          details: razorpayResult.error || "Failed to create payment order",
        },
        { status: 500 },
      )
    }

    if (!razorpayResult.order || !razorpayResult.order.id) {
      console.error("❌ Invalid Razorpay order response:", razorpayResult)
      return NextResponse.json(
        {
          success: false,
          error: "Invalid payment order",
          details: "Payment gateway returned invalid order",
        },
        { status: 500 },
      )
    }

    console.log("✅ Razorpay order created successfully:", razorpayResult.order.id)

    // Create pending order in database
    console.log("💾 Creating order in database...")
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        total_amount: amount,
        customer_name: orderData.customerName.trim(),
        customer_email: orderData.customerEmail.trim(),
        customer_phone: orderData.customerPhone.trim(),
        shipping_address: orderData.shippingAddress.trim(),
        status: "pending",
        payment_status: "pending",
        razorpay_order_id: razorpayResult.order.id,
        payment_method: "razorpay",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (orderError) {
      console.error("❌ Database order creation error:", orderError)
      return NextResponse.json(
        {
          success: false,
          error: "Database error",
          details: orderError.message || "Failed to create order record",
        },
        { status: 500 },
      )
    }

    if (!order || !order.id) {
      console.error("❌ Invalid order creation response:", order)
      return NextResponse.json(
        {
          success: false,
          error: "Order creation failed",
          details: "Failed to create order record",
        },
        { status: 500 },
      )
    }

    console.log("✅ Order created in database:", order.id)

    // Create order items
    if (orderData.items && Array.isArray(orderData.items) && orderData.items.length > 0) {
      console.log("📦 Creating order items...")
      const orderItems = orderData.items.map((item: any) => ({
        order_id: order.id,
        product_id: item.id || 0,
        product_name: item.name || "Unknown Product",
        product_price: item.price || 0,
        quantity: item.quantity || 1,
        created_at: new Date().toISOString(),
      }))

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

      if (itemsError) {
        console.error("❌ Order items creation error:", itemsError)
        // Don't fail the entire process, but log the error
      } else {
        console.log("✅ Order items created successfully")
      }
    }

    // Return successful response
    const response = {
      success: true,
      razorpayOrder: {
        id: razorpayResult.order.id,
        amount: razorpayResult.order.amount,
        currency: razorpayResult.order.currency,
        receipt: razorpayResult.order.receipt,
      },
      orderId: order.id,
    }

    console.log("🎉 Sending successful response:", {
      success: response.success,
      razorpayOrderId: response.razorpayOrder.id,
      orderId: response.orderId,
    })

    return NextResponse.json(response, { status: 200 })
  } catch (error: any) {
    console.error("❌ Create Razorpay order API error:", error)

    // Return proper JSON error response
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error.message || "An unexpected error occurred",
      },
      { status: 500 },
    )
  }
}
