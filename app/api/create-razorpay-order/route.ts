import { type NextRequest, NextResponse } from "next/server"
import { createRazorpayOrder } from "@/lib/razorpay"
import { getSupabaseClient } from "@/lib/supabase-client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency, receipt, userId, orderData } = body

    if (!amount || !currency || !receipt || !userId || !orderData) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 },
      )
    }

    // Create Razorpay order
    const razorpayOrder = await createRazorpayOrder({
      amount,
      currency,
      receipt,
    })

    if (!razorpayOrder || !razorpayOrder.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to create Razorpay order",
        },
        { status: 500 },
      )
    }

    // Create order in database
    const supabase = getSupabaseClient()

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        total_amount: amount,
        status: "pending",
        payment_status: "pending",
        payment_method: "Razorpay",
        razorpay_order_id: razorpayOrder.id,
        customer_name: orderData.customerName,
        customer_email: orderData.customerEmail,
        customer_phone: orderData.customerPhone,
        shipping_address: orderData.shippingAddress,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (orderError) {
      console.error("Order creation error:", orderError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to create order in database",
        },
        { status: 500 },
      )
    }

    // Create order items
    const orderItems = orderData.items.map((item: any) => ({
      order_id: order.id,
      product_name: item.name,
      product_price: item.price,
      quantity: item.quantity,
      created_at: new Date().toISOString(),
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("Order items creation error:", itemsError)
      // Don't fail the order creation if items fail
    }

    return NextResponse.json({
      success: true,
      razorpayOrder,
      orderId: order.id,
    })
  } catch (error: any) {
    console.error("Create order error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create order",
      },
      { status: 500 },
    )
  }
}
