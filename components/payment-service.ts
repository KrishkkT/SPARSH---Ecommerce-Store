"use client"

declare global {
  interface Window {
    Razorpay: any
  }
}

export interface PaymentOptions {
  amount: number
  currency: string
  orderId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  onSuccess: (response: any) => void
  onError: (error: any) => void
}

export class PaymentService {
  private static loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true)
        return
      }

      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  private static async getRazorpayConfig(): Promise<{ keyId: string }> {
    try {
      const response = await fetch("/api/get-razorpay-config")
      if (!response.ok) {
        throw new Error("Failed to get Razorpay configuration")
      }
      const data = await response.json()
      if (!data.success) {
        throw new Error(data.error || "Invalid Razorpay configuration")
      }
      return { keyId: data.keyId }
    } catch (error) {
      console.error("Error fetching Razorpay config:", error)
      throw new Error("Unable to load payment configuration")
    }
  }

  static async initiatePayment(options: PaymentOptions) {
    try {
      console.log("Initiating payment with options:", {
        amount: options.amount,
        currency: options.currency,
        orderId: options.orderId,
        customerName: options.customerName,
        customerEmail: options.customerEmail,
      })

      // Load Razorpay script
      const isLoaded = await this.loadRazorpayScript()
      if (!isLoaded) {
        throw new Error("Failed to load Razorpay SDK. Please check your internet connection and try again.")
      }

      // Get Razorpay configuration from server
      const config = await this.getRazorpayConfig()

      // Validate options
      if (!options.amount || options.amount <= 0) {
        throw new Error("Invalid payment amount")
      }

      if (!options.orderId) {
        throw new Error("Order ID is required")
      }

      const razorpayOptions = {
        key: config.keyId,
        amount: Math.round(options.amount * 100), // Convert to paise
        currency: options.currency,
        name: "SPARSH Natural Hair Care",
        description: "Premium Hair Care Products",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-25%20153324-QJsoQScO5touZXDswxzKaUYgsFNNLt.png",
        order_id: options.orderId,
        handler: (response: any) => {
          console.log("Payment successful:", response)
          if (response.razorpay_payment_id && response.razorpay_order_id && response.razorpay_signature) {
            options.onSuccess(response)
          } else {
            options.onError({
              error: "Invalid payment response",
              description: "Payment response is missing required fields",
            })
          }
        },
        prefill: {
          name: options.customerName,
          email: options.customerEmail,
          contact: options.customerPhone,
        },
        notes: {
          address: "SPARSH Natural Hair Care",
        },
        theme: {
          color: "#10b981",
        },
        modal: {
          ondismiss: () => {
            console.log("Payment modal dismissed")
            options.onError({
              error: "Payment cancelled",
              description: "Payment was cancelled by user",
            })
          },
          confirm_close: true,
        },
        retry: {
          enabled: true,
          max_count: 3,
        },
      }

      console.log("Creating Razorpay instance with options:", {
        key: razorpayOptions.key,
        amount: razorpayOptions.amount,
        currency: razorpayOptions.currency,
        order_id: razorpayOptions.order_id,
      })

      const razorpay = new window.Razorpay(razorpayOptions)

      razorpay.on("payment.failed", (response: any) => {
        console.error("Payment failed:", response.error)
        options.onError({
          error: "Payment failed",
          description: response.error?.description || "Payment could not be processed",
          code: response.error?.code,
          reason: response.error?.reason,
        })
      })

      console.log("Opening Razorpay payment modal...")
      razorpay.open()
    } catch (error: any) {
      console.error("Payment initiation error:", error)
      options.onError({
        error: "Payment setup failed",
        description: error.message || "Unable to initialize payment",
      })
    }
  }
}
