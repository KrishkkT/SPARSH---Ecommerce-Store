import { type NextRequest, NextResponse } from "next/server"
import { verifyRazorpaySignature } from "@/lib/razorpay"
import { supabase } from "@/lib/supabase"
import { EmailService } from "@/components/email-service"

export async function POST(request: NextRequest) {
  try {
    console.log("=== PAYMENT VERIFICATION STARTED ===")

    // Parse JSON with proper error handling
    let body
    try {
      const requestText = await request.text()
      if (!requestText) {
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
    } catch (parseError) {
      console.error("JSON parsing error:", parseError)
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON format",
          details: "Request body must contain valid JSON",
        },
        { status: 400 },
      )
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = body

    console.log("Payment verification request:", {
      razorpay_order_id: !!razorpay_order_id,
      razorpay_payment_id: !!razorpay_payment_id,
      razorpay_signature: !!razorpay_signature,
      order_id: !!order_id,
    })

    // Validate required fields
    if (!razorpay_order_id || typeof razorpay_order_id !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Missing razorpay_order_id",
          details: "razorpay_order_id is required",
        },
        { status: 400 },
      )
    }

    if (!razorpay_payment_id || typeof razorpay_payment_id !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Missing razorpay_payment_id",
          details: "razorpay_payment_id is required",
        },
        { status: 400 },
      )
    }

    if (!razorpay_signature || typeof razorpay_signature !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Missing razorpay_signature",
          details: "razorpay_signature is required",
        },
        { status: 400 },
      )
    }

    if (!order_id || typeof order_id !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Missing order_id",
          details: "order_id is required",
        },
        { status: 400 },
      )
    }

    // Verify Razorpay signature
    console.log("Verifying Razorpay signature...")
    const isValidSignature = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)

    if (!isValidSignature) {
      console.error("Invalid payment signature")
      return NextResponse.json(
        {
          success: false,
          error: "Payment verification failed",
          details: "Invalid payment signature",
        },
        { status: 400 },
      )
    }

    console.log("Payment signature verified successfully")

    // Update order with payment details
    const { data: updatedOrder, error: updateError } = await supabase
      .from("orders")
      .update({
        payment_status: "completed",
        status: "confirmed",
        razorpay_payment_id,
        razorpay_signature,
        updated_at: new Date().toISOString(),
      })
      .eq("id", order_id)
      .select(`
        *,
        order_items (*)
      `)
      .single()

    if (updateError) {
      console.error("Order update error:", updateError)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to update order",
          details: updateError.message || "Database update failed",
        },
        { status: 500 },
      )
    }

    if (!updatedOrder) {
      console.error("Order not found:", order_id)
      return NextResponse.json(
        {
          success: false,
          error: "Order not found",
          details: "Order ID does not exist",
        },
        { status: 404 },
      )
    }

    console.log("Order updated successfully:", updatedOrder.id)

    // Send confirmation emails (don't fail if email fails)
    try {
      const orderDetails = {
        customer_name: updatedOrder.customer_name,
        customer_email: updatedOrder.customer_email,
        customer_phone: updatedOrder.customer_phone,
        shipping_address: updatedOrder.shipping_address,
        total_amount: updatedOrder.total_amount,
        order_items:
          updatedOrder.order_items?.map((item: any) => ({
            product_name: item.product_name,
            product_price: item.product_price,
            quantity: item.quantity,
            subtotal: item.product_price * item.quantity,
          })) || [],
        order_date: updatedOrder.created_at,
        user_id: updatedOrder.user_id,
        order_id: updatedOrder.id,
        payment_id: razorpay_payment_id,
        payment_method: "Razorpay",
        payment_status: "completed",
      }

      console.log("Sending confirmation emails...")

      // Send customer confirmation email (Nodemailer)
      const customerEmailResult = await EmailService.sendOrderConfirmation(orderDetails)
      console.log("Customer email result:", customerEmailResult)

      // Send admin notification email (Formspree)
      const adminEmailResult = await EmailService.sendAdminOrderNotification(orderDetails)
      console.log("Admin email result:", adminEmailResult)

      console.log("Email sending completed:", {
        customer: customerEmailResult.success,
        admin: adminEmailResult.success,
      })
    } catch (emailError) {
      console.error("Email sending error:", emailError)
      // Don't fail the payment verification if email fails
    }

    console.log("=== PAYMENT VERIFICATION COMPLETED SUCCESSFULLY ===")

    return NextResponse.json(
      {
        success: true,
        message: "Payment verified successfully",
        order: {
          id: updatedOrder.id,
          status: updatedOrder.status,
          payment_status: updatedOrder.payment_status,
          total_amount: updatedOrder.total_amount,
        },
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Payment verification API error:", error)
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
