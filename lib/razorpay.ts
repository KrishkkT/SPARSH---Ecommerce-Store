import crypto from "crypto"

// Environment variables validation with live keys
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET

if (!RAZORPAY_KEY_ID) {
  console.error("RAZORPAY_KEY_ID environment variable is missing")
  throw new Error("RAZORPAY_KEY_ID environment variable is not set")
}

if (!RAZORPAY_KEY_SECRET) {
  console.error("RAZORPAY_KEY_SECRET environment variable is missing")
  throw new Error("RAZORPAY_KEY_SECRET environment variable is not set")
}

// Validate that we're using live keys in production
if (process.env.NODE_ENV === "production" && !RAZORPAY_KEY_ID.startsWith("rzp_live_")) {
  console.warn("⚠️ WARNING: Using test Razorpay keys in production environment!")
}

console.log("Razorpay configuration:", {
  keyId: RAZORPAY_KEY_ID ? `${RAZORPAY_KEY_ID.substring(0, 12)}...` : "missing",
  keyType: RAZORPAY_KEY_ID?.startsWith("rzp_live_") ? "LIVE" : "TEST",
  environment: process.env.NODE_ENV,
})

const RAZORPAY_BASE_URL = "https://api.razorpay.com/v1"

// Create Basic Auth header
const getAuthHeader = () => {
  try {
    const credentials = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64")
    return `Basic ${credentials}`
  } catch (error) {
    console.error("Error creating auth header:", error)
    throw new Error("Failed to create authentication header")
  }
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
      keyId: RAZORPAY_KEY_ID ? `${RAZORPAY_KEY_ID.substring(0, 12)}...` : "missing",
      keyType: RAZORPAY_KEY_ID?.startsWith("rzp_live_") ? "LIVE" : "TEST",
    })

    const orderData = {
      amount: options.amount,
      currency: options.currency,
      receipt: options.receipt,
      notes: options.notes || {},
      payment_capture: 1, // Auto capture
    }

    // Make API call to Razorpay with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

    const response = await fetch(`${RAZORPAY_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        Authorization: getAuthHeader(),
        "Content-Type": "application/json",
        "User-Agent": "SPARSH-Ecommerce/2.0",
      },
      body: JSON.stringify(orderData),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    console.log("Razorpay API response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Razorpay API error response:", errorText)

      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { error: { description: errorText } }
      }

      throw new Error(
        `Razorpay API Error (${response.status}): ${
          errorData.error?.description || errorData.message || response.statusText
        }`,
      )
    }

    const order = await response.json()
    console.log("Razorpay order response:", {
      id: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      keyType: RAZORPAY_KEY_ID?.startsWith("rzp_live_") ? "LIVE" : "TEST",
    })

    if (!order || !order.id) {
      throw new Error("Invalid order response from Razorpay")
    }

    console.log("Razorpay order created successfully:", order.id)
    return { success: true, order }
  } catch (error: any) {
    console.error("Razorpay order creation error:", error)

    // Handle specific error types
    if (error.name === "AbortError") {
      return {
        success: false,
        error: "Request timeout: Razorpay API took too long to respond",
      }
    }

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

    console.log("Verifying payment signature:", {
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      keyType: RAZORPAY_KEY_ID?.startsWith("rzp_live_") ? "LIVE" : "TEST",
    })

    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex")

    const isValid = expectedSignature === razorpaySignature
    console.log("Signature verification result:", {
      isValid,
      keyType: RAZORPAY_KEY_ID?.startsWith("rzp_live_") ? "LIVE" : "TEST",
    })
    return isValid
  } catch (error) {
    console.error("Signature verification error:", error)
    return false
  }
}

// Fetch payment details with retry logic
export const fetchPaymentDetails = async (paymentId: string, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Fetching payment details (attempt ${attempt}):`, {
        paymentId,
        keyType: RAZORPAY_KEY_ID?.startsWith("rzp_live_") ? "LIVE" : "TEST",
      })

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

      const response = await fetch(`${RAZORPAY_BASE_URL}/payments/${paymentId}`, {
        method: "GET",
        headers: {
          Authorization: getAuthHeader(),
          "Content-Type": "application/json",
          "User-Agent": "SPARSH-Ecommerce/2.0",
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          `Razorpay API Error (${response.status}): ${
            errorData.error?.description || errorData.message || response.statusText
          }`,
        )
      }

      const payment = await response.json()
      console.log("Payment details fetched successfully:", {
        id: payment.id,
        status: payment.status,
        amount: payment.amount,
        keyType: RAZORPAY_KEY_ID?.startsWith("rzp_live_") ? "LIVE" : "TEST",
      })
      return { success: true, payment }
    } catch (error: any) {
      console.error(`Fetch payment details attempt ${attempt} failed:`, error)

      if (attempt === retries) {
        return {
          success: false,
          error: error.message || "Failed to fetch payment details",
        }
      }

      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
    }
  }

  return {
    success: false,
    error: "Failed to fetch payment details after retries",
  }
}

// Fetch order details
export const fetchOrderDetails = async (orderId: string, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Fetching order details (attempt ${attempt}):`, {
        orderId,
        keyType: RAZORPAY_KEY_ID?.startsWith("rzp_live_") ? "LIVE" : "TEST",
      })

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)

      const response = await fetch(`${RAZORPAY_BASE_URL}/orders/${orderId}`, {
        method: "GET",
        headers: {
          Authorization: getAuthHeader(),
          "Content-Type": "application/json",
          "User-Agent": "SPARSH-Ecommerce/2.0",
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          `Razorpay API Error (${response.status}): ${
            errorData.error?.description || errorData.message || response.statusText
          }`,
        )
      }

      const order = await response.json()
      console.log("Order details fetched successfully:", {
        id: order.id,
        status: order.status,
        amount: order.amount,
        keyType: RAZORPAY_KEY_ID?.startsWith("rzp_live_") ? "LIVE" : "TEST",
      })
      return { success: true, order }
    } catch (error: any) {
      console.error(`Fetch order details attempt ${attempt} failed:`, error)

      if (attempt === retries) {
        return {
          success: false,
          error: error.message || "Failed to fetch order details",
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
    }
  }

  return {
    success: false,
    error: "Failed to fetch order details after retries",
  }
}

// List orders
export const listOrders = async (count = 10, skip = 0) => {
  try {
    console.log("Listing Razorpay orders:", {
      count,
      skip,
      keyType: RAZORPAY_KEY_ID?.startsWith("rzp_live_") ? "LIVE" : "TEST",
    })

    const response = await fetch(`${RAZORPAY_BASE_URL}/orders?count=${count}&skip=${skip}`, {
      method: "GET",
      headers: {
        Authorization: getAuthHeader(),
        "Content-Type": "application/json",
        "User-Agent": "SPARSH-Ecommerce/2.0",
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

    const data = await response.json()
    console.log("Orders listed successfully:", {
      count: data.items?.length || 0,
      keyType: RAZORPAY_KEY_ID?.startsWith("rzp_live_") ? "LIVE" : "TEST",
    })
    return { success: true, orders: data.items || [] }
  } catch (error: any) {
    console.error("List orders error:", error)
    return {
      success: false,
      error: error.message || "Failed to list orders",
    }
  }
}

// List payments
export const listPayments = async (count = 10, skip = 0) => {
  try {
    console.log("Listing Razorpay payments:", {
      count,
      skip,
      keyType: RAZORPAY_KEY_ID?.startsWith("rzp_live_") ? "LIVE" : "TEST",
    })

    const response = await fetch(`${RAZORPAY_BASE_URL}/payments?count=${count}&skip=${skip}`, {
      method: "GET",
      headers: {
        Authorization: getAuthHeader(),
        "Content-Type": "application/json",
        "User-Agent": "SPARSH-Ecommerce/2.0",
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

    const data = await response.json()
    console.log("Payments listed successfully:", {
      count: data.items?.length || 0,
      keyType: RAZORPAY_KEY_ID?.startsWith("rzp_live_") ? "LIVE" : "TEST",
    })
    return { success: true, payments: data.items || [] }
  } catch (error: any) {
    console.error("List payments error:", error)
    return {
      success: false,
      error: error.message || "Failed to list payments",
    }
  }
}

// Create refund
export const createRefund = async (paymentId: string, amount?: number, notes?: Record<string, string>) => {
  try {
    console.log("Creating refund:", {
      paymentId,
      amount,
      keyType: RAZORPAY_KEY_ID?.startsWith("rzp_live_") ? "LIVE" : "TEST",
    })

    const refundData: any = {
      notes: notes || {},
    }

    if (amount) {
      refundData.amount = amount
    }

    const response = await fetch(`${RAZORPAY_BASE_URL}/payments/${paymentId}/refund`, {
      method: "POST",
      headers: {
        Authorization: getAuthHeader(),
        "Content-Type": "application/json",
        "User-Agent": "SPARSH-Ecommerce/2.0",
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
    console.log("Refund created successfully:", {
      id: refund.id,
      amount: refund.amount,
      status: refund.status,
      keyType: RAZORPAY_KEY_ID?.startsWith("rzp_live_") ? "LIVE" : "TEST",
    })
    return { success: true, refund }
  } catch (error: any) {
    console.error("Create refund error:", error)
    return {
      success: false,
      error: error.message || "Failed to create refund",
    }
  }
}
