import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { razorpay } from "@/lib/razorpay"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      user_id,
      items,
      total_amount,
      shipping_address,
      billing_address,
      payment_method = "razorpay",
      shipping_charges = 0,
      tax_amount = 0,
    } = body

    // Validate required fields
    if (!user_id || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Missing required fields: user_id, items" }, { status: 400 })
    }

    if (!total_amount || total_amount <= 0) {
      return NextResponse.json({ error: "Invalid total amount" }, { status: 400 })
    }

    if (!shipping_address || !billing_address) {
      return NextResponse.json({ error: "Shipping and billing addresses are required" }, { status: 400 })
    }

    const supabase = createClient()

    // Verify user exists
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, email, full_name")
      .eq("id", user_id)
      .single()

    if (userError || !user) {
      console.error("User verification error:", userError)
      return NextResponse.json({ error: "Invalid user" }, { status: 400 })
    }

    // Validate items and check stock
    const productIds = items.map((item: any) => item.product_id)
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, name, price, stock_quantity")
      .in("id", productIds)

    if (productsError) {
      console.error("Products fetch error:", productsError)
      return NextResponse.json({ error: "Error fetching products" }, { status: 500 })
    }

    // Check stock availability
    for (const item of items) {
      const product = products?.find((p) => p.id === item.product_id)
      if (!product) {
        return NextResponse.json({ error: `Product ${item.product_id} not found` }, { status: 400 })
      }
      if (product.stock_quantity < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${product.name}` }, { status: 400 })
      }
    }

    // Calculate order total
    let calculated_total = 0
    for (const item of items) {
      const product = products?.find((p) => p.id === item.product_id)
      if (product) {
        calculated_total += product.price * item.quantity
      }
    }
    calculated_total += shipping_charges + tax_amount

    // Verify total matches
    if (Math.abs(calculated_total - total_amount) > 0.01) {
      return NextResponse.json({ error: "Total amount mismatch" }, { status: 400 })
    }

    // Create receipt ID for Razorpay (max 40 characters)
    const timestamp = Date.now().toString()
    const randomStr = crypto.randomBytes(8).toString("hex")
    const receipt_id = `order_${timestamp.slice(-8)}_${randomStr.slice(0, 8)}`

    // Create Razorpay order
    let razorpay_order_id = null
    try {
      const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(total_amount * 100), // Convert to paise
        currency: "INR",
        receipt: receipt_id,
        notes: {
          user_id: user_id,
          user_email: user.email,
          order_type: "ecommerce",
        },
      })
      razorpay_order_id = razorpayOrder.id
    } catch (razorpayError: any) {
      console.error("Razorpay order creation error:", razorpayError)
      return NextResponse.json({ error: "Payment gateway error", details: razorpayError.message }, { status: 500 })
    }

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id,
        total_amount,
        status: "pending",
        payment_method,
        payment_status: "pending",
        shipping_address: JSON.stringify(shipping_address),
        billing_address: JSON.stringify(billing_address),
        razorpay_order_id,
        receipt_id,
        shipping_charges,
        tax_amount,
      })
      .select()
      .single()

    if (orderError) {
      console.error("Order creation error:", orderError)
      return NextResponse.json({ error: "Failed to create order", details: orderError.message }, { status: 500 })
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: products?.find((p) => p.id === item.product_id)?.price || 0,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("Order items creation error:", itemsError)
      // Rollback order creation
      await supabase.from("orders").delete().eq("id", order.id)
      return NextResponse.json({ error: "Failed to create order items", details: itemsError.message }, { status: 500 })
    }

    // Update product stock
    for (const item of items) {
      const { error: stockError } = await supabase
        .from("products")
        .update({
          stock_quantity: supabase.sql`stock_quantity - ${item.quantity}`,
        })
        .eq("id", item.product_id)

      if (stockError) {
        console.error("Stock update error:", stockError)
        // Continue with order creation even if stock update fails
      }
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        razorpay_order_id,
        amount: total_amount,
        currency: "INR",
        receipt_id,
      },
      message: "Order created successfully",
    })
  } catch (error: any) {
    console.error("Order creation error:", error)
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 })
  }
}
