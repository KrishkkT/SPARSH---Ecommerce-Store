import crypto from "crypto"

// Environment variables validation with better error messages
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
      keyId: RAZORPAY_KEY_ID ? `${RAZORPAY_KEY_ID.substring(0, 8)}...` : "missing",
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
        "User-Agent": "SPARSH-Ecommerce/1.0",
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
    console.log("Razorpay order response:", { id: order.id, status: order.status, amount: order.amount })

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

// Fetch payment details with retry logic
export const fetchPaymentDetails = async (paymentId: string, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

      const response = await fetch(`${RAZORPAY_BASE_URL}/payments/${paymentId}`, {
        method: "GET",
        headers: {
          Authorization: getAuthHeader(),
          "Content-Type": "application/json",
          "User-Agent": "SPARSH-Ecommerce/1.0",
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
