import crypto from "crypto"

// Validate environment variables
if (!process.env.RAZORPAY_KEY_ID) {
  throw new Error("RAZORPAY_KEY_ID environment variable is not set")
}

if (!process.env.RAZORPAY_KEY_SECRET) {
  throw new Error("RAZORPAY_KEY_SECRET environment variable is not set")
}

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID!
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!
const RAZORPAY_BASE_URL = "https://api.razorpay.com/v1"

// Create Basic Auth header
const getAuthHeader = () => {
  const credentials = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64")
  return `Basic ${credentials}`
}

// Razorpay order creation options
export interface RazorpayOrderOptions {
  amount: number // amount in paise (multiply by 100)
  currency: string
  receipt: string
  notes?: Record<string, string>
}

// Create Razorpay order using REST API
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

    // Make API call to Razorpay
    const response = await fetch(`${RAZORPAY_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        Authorization: getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Razorpay API error:", response.status, errorData)

      throw new Error(
        `Razorpay API Error (${response.status}): ${
          errorData.error?.description || errorData.message || response.statusText
        }`,
      )
    }

    const order = await response.json()

    if (!order || !order.id) {
      throw new Error("Invalid order response from Razorpay")
    }

    console.log("Razorpay order created successfully:", order.id)
    return { success: true, order }
  } catch (error: any) {
    console.error("Razorpay order creation error:", error)

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

    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
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

// Fetch payment details
export const fetchPaymentDetails = async (paymentId: string) => {
  try {
    const response = await fetch(`${RAZORPAY_BASE_URL}/payments/${paymentId}`, {
      method: "GET",
      headers: {
        Authorization: getAuthHeader(),
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        `Razorpay API Error (${response.status}): ${
          errorData.error?.description || errorData.message || response.statusText
        }`,
      )
    }

    const payment = await response.json()
    return { success: true, payment }
  } catch (error: any) {
    console.error("Fetch payment details error:", error)
    return {
      success: false,
      error: error.message || "Failed to fetch payment details",
    }
  }
}

// Fetch order details
export const fetchOrderDetails = async (orderId: string) => {
  try {
    const response = await fetch(`${RAZORPAY_BASE_URL}/orders/${orderId}`, {
      method: "GET",
      headers: {
        Authorization: getAuthHeader(),
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        `Razorpay API Error (${response.status}): ${
          errorData.error?.description || errorData.message || response.statusText
        }`,
      )
    }

    const order = await response.json()
    return { success: true, order }
  } catch (error: any) {
    console.error("Fetch order details error:", error)
    return {
      success: false,
      error: error.message || "Failed to fetch order details",
    }
  }
}

// Create refund
export const createRefund = async (paymentId: string, amount?: number, notes?: Record<string, string>) => {
  try {
    const refundData: any = {
      payment_id: paymentId,
    }

    if (amount) {
      refundData.amount = amount
    }

    if (notes) {
      refundData.notes = notes
    }

    const response = await fetch(`${RAZORPAY_BASE_URL}/refunds`, {
      method: "POST",
      headers: {
        Authorization: getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(refundData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        `Razorpay API Error (${response.status}): ${
          errorData.error?.description || errorData.message || response.statusText
        }`,
      )
    }

    const refund = await response.json()
    return { success: true, refund }
  } catch (error: any) {
    console.error("Create refund error:", error)
    return {
      success: false,
      error: error.message || "Failed to create refund",
    }
  }
}

// List all orders
export const listOrders = async (count = 10, skip = 0) => {
  try {
    const params = new URLSearchParams({
      count: count.toString(),
      skip: skip.toString(),
    })

    const response = await fetch(`${RAZORPAY_BASE_URL}/orders?${params}`, {
      method: "GET",
      headers: {
        Authorization: getAuthHeader(),
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        `Razorpay API Error (${response.status}): ${
          errorData.error?.description || errorData.message || response.statusText
        }`,
      )
    }

    const orders = await response.json()
    return { success: true, orders }
  } catch (error: any) {
    console.error("List orders error:", error)
    return {
      success: false,
      error: error.message || "Failed to list orders",
    }
  }
}

// List all payments
export const listPayments = async (count = 10, skip = 0) => {
  try {
    const params = new URLSearchParams({
      count: count.toString(),
      skip: skip.toString(),
    })

    const response = await fetch(`${RAZORPAY_BASE_URL}/payments?${params}`, {
      method: "GET",
      headers: {
        Authorization: getAuthHeader(),
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        `Razorpay API Error (${response.status}): ${
          errorData.error?.description || errorData.message || response.statusText
        }`,
      )
    }

    const payments = await response.json()
    return { success: true, payments }
  } catch (error: any) {
    console.error("List payments error:", error)
    return {
      success: false,
      error: error.message || "Failed to list payments",
    }
  }
}
