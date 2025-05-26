import Razorpay from "razorpay"

// Validate environment variables
if (!process.env.RAZORPAY_KEY_ID) {
  throw new Error("RAZORPAY_KEY_ID environment variable is not set")
}

if (!process.env.RAZORPAY_KEY_SECRET) {
  throw new Error("RAZORPAY_KEY_SECRET environment variable is not set")
}

// Initialize Razorpay instance
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// Razorpay order creation options
export interface RazorpayOrderOptions {
  amount: number // amount in paise (multiply by 100)
  currency: string
  receipt: string
  notes?: Record<string, string>
}

// Create Razorpay order
export const createRazorpayOrder = async (options: RazorpayOrderOptions) => {
  try {
    // Validate inputs
    if (!options.amount || typeof options.amount !== "number" || options.amount <= 0) {
      throw new Error("Invalid amount: must be positive number")
    }

    if (!options.currency || typeof options.currency !== "string") {
      throw new Error("Currency is required")
    }

    if (!options.receipt || typeof options.receipt !== "string") {
      throw new Error("Receipt is required")
    }

    console.log("Creating Razorpay order with options:", {
      amount: options.amount,
      currency: options.currency,
      receipt: options.receipt,
      notes: options.notes,
    })

    const orderData = {
      amount: options.amount,
      currency: options.currency,
      receipt: options.receipt,
      notes: options.notes || {},
      payment_capture: 1, // Auto capture
    }

    const order = await razorpay.orders.create(orderData)

    if (!order || !order.id) {
      throw new Error("Invalid order response from Razorpay")
    }

    console.log("Razorpay order created successfully:", order.id)
    return { success: true, order }
  } catch (error: any) {
    console.error("Razorpay order creation error:", error)

    // Handle specific Razorpay errors
    if (error.statusCode) {
      return {
        success: false,
        error: `Razorpay API Error (${error.statusCode}): ${error.error?.description || error.message}`,
      }
    }

    // Handle network errors
    if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
      return {
        success: false,
        error: "Network error: Unable to connect to Razorpay",
      }
    }

    return {
      success: false,
      error: error.message || "Unknown Razorpay error",
    }
  }
}

// Verify Razorpay payment signature
export const verifyRazorpaySignature = (
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
): boolean => {
  try {
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      console.error("Missing required parameters for signature verification")
      return false
    }

    const crypto = require("crypto")
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex")

    const isValid = expectedSignature === razorpaySignature
    console.log("Signature verification result:", isValid)
    return isValid
  } catch (error) {
    console.error("Signature verification error:", error)
    return false
  }
}
