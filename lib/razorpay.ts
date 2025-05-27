import crypto from "crypto"

// Environment variables validation with better error handling
const getEnvironmentVariables = () => {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  console.log("Environment check:", {
    keyId: keyId ? `${keyId.substring(0, 12)}...` : "MISSING",
    keySecret: keySecret ? "PRESENT" : "MISSING",
    nodeEnv: process.env.NODE_ENV,
    allEnvKeys: Object.keys(process.env).filter((key) => key.includes("RAZORPAY")),
  })

  if (!keyId) {
    console.error("❌ RAZORPAY_KEY_ID environment variable is missing")
    console.error(
      "Available env vars:",
      Object.keys(process.env).filter((key) => key.includes("RAZORPAY")),
    )
    throw new Error("RAZORPAY_KEY_ID environment variable is not set")
  }

  if (!keySecret) {
    console.error("❌ RAZORPAY_KEY_SECRET environment variable is missing")
    console.error(
      "Available env vars:",
      Object.keys(process.env).filter((key) => key.includes("RAZORPAY")),
    )
    throw new Error("RAZORPAY_KEY_SECRET environment variable is not set")
  }

  return { keyId, keySecret }
}

const RAZORPAY_BASE_URL = "https://api.razorpay.com/v1"

// Create Basic Auth header with validation
const getAuthHeader = () => {
  try {
    const { keyId, keySecret } = getEnvironmentVariables()
    const credentials = Buffer.from(`${keyId}:${keySecret}`).toString("base64")
    console.log("Auth header created successfully for key:", `${keyId.substring(0, 12)}...`)
    return `Basic ${credentials}`
  } catch (error) {
    console.error("❌ Error creating auth header:", error)
    throw new Error("Failed to create authentication header: " + error.message)
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
    console.log("🚀 Starting Razorpay order creation...")

    // Get and validate environment variables
    const { keyId, keySecret } = getEnvironmentVariables()

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

    console.log("✅ Creating Razorpay order with options:", {
      amount: options.amount,
      currency: options.currency,
      receipt: options.receipt,
      notes: options.notes,
      keyId: keyId ? `${keyId.substring(0, 12)}...` : "missing",
      keyType: keyId?.startsWith("rzp_live_") ? "LIVE" : "TEST",
    })

    const orderData = {
      amount: options.amount,
      currency: options.currency,
      receipt: options.receipt,
      notes: options.notes || {},
      payment_capture: 1, // Auto capture
    }

    // Create auth header
    const authHeader = getAuthHeader()

    // Make API call to Razorpay with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

    console.log("📡 Making API call to Razorpay...")
    const response = await fetch(`${RAZORPAY_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
        "User-Agent": "SPARSH-Ecommerce/2.0",
      },
      body: JSON.stringify(orderData),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    console.log("📡 Razorpay API response status:", response.status)
    console.log("📡 Response headers:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ Razorpay API error response:", errorText)

      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { error: { description: errorText } }
      }

      // Log detailed error information
      console.error("❌ Detailed error:", {
        status: response.status,
        statusText: response.statusText,
        errorData,
        keyUsed: keyId ? `${keyId.substring(0, 12)}...` : "missing",
      })

      throw new Error(
        `Razorpay API Error (${response.status}): ${
          errorData.error?.description || errorData.message || response.statusText
        }`,
      )
    }

    const order = await response.json()
    console.log("✅ Razorpay order response:", {
      id: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      keyType: keyId?.startsWith("rzp_live_") ? "LIVE" : "TEST",
    })

    if (!order || !order.id) {
      throw new Error("Invalid order response from Razorpay")
    }

    console.log("🎉 Razorpay order created successfully:", order.id)
    return { success: true, order }
  } catch (error: any) {
    console.error("❌ Razorpay order creation error:", error)

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
      console.error("❌ Missing required parameters for signature verification")
      return false
    }

    const { keySecret } = getEnvironmentVariables()

    console.log("🔐 Verifying payment signature:", {
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
    })

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex")

    const isValid = expectedSignature === razorpaySignature
    console.log("🔐 Signature verification result:", {
      isValid,
      expectedLength: expectedSignature.length,
      receivedLength: razorpaySignature.length,
    })
    return isValid
  } catch (error) {
    console.error("❌ Signature verification error:", error)
    return false
  }
}

// Fetch payment details with retry logic
export const fetchPaymentDetails = async (paymentId: string, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const { keyId } = getEnvironmentVariables()

      console.log(`📡 Fetching payment details (attempt ${attempt}):`, {
        paymentId,
        keyType: keyId?.startsWith("rzp_live_") ? "LIVE" : "TEST",
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
      console.log("✅ Payment details fetched successfully:", {
        id: payment.id,
        status: payment.status,
        amount: payment.amount,
      })
      return { success: true, payment }
    } catch (error: any) {
      console.error(`❌ Fetch payment details attempt ${attempt} failed:`, error)

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
