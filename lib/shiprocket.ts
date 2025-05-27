// Shiprocket API Configuration
const SHIPROCKET_BASE_URL = "https://apiv2.shiprocket.in"

// Types for Shiprocket API
export interface ShiprocketAuthResponse {
  token: string
  first_name: string
  last_name: string
  email: string
  company_id: number
  id: number
}

export interface ShiprocketOrder {
  order_id: string
  order_date: string
  pickup_location: string
  billing_customer_name: string
  billing_last_name: string
  billing_address: string
  billing_address_2?: string
  billing_city: string
  billing_pincode: string
  billing_state: string
  billing_country: string
  billing_email: string
  billing_phone: string
  shipping_is_billing: boolean
  shipping_customer_name?: string
  shipping_last_name?: string
  shipping_address?: string
  shipping_address_2?: string
  shipping_city?: string
  shipping_pincode?: string
  shipping_state?: string
  shipping_country?: string
  shipping_email?: string
  shipping_phone?: string
  order_items: ShiprocketOrderItem[]
  payment_method: string
  shipping_charges: number
  giftwrap_charges: number
  transaction_charges: number
  total_discount: number
  sub_total: number
  length: number
  breadth: number
  height: number
  weight: number
}

export interface ShiprocketOrderItem {
  name: string
  sku: string
  units: number
  selling_price: number
  discount?: number
  tax?: number
  hsn?: number
}

export interface ShiprocketServiceabilityRequest {
  pickup_postcode: string
  delivery_postcode: string
  weight: number
  cod: number
}

export interface ShiprocketTrackingResponse {
  tracking_data: {
    track_status: number
    shipment_status: string
    shipment_track: Array<{
      date: string
      status: string
      activity: string
      location: string
    }>
  }
}

export interface ShiprocketAWBRequest {
  shipment_id: number
  courier_id: number
}

export interface ShiprocketLabelRequest {
  shipment_id: number[]
}

export interface ShiprocketReturnRequest {
  order_id: string
  order_date: string
  pickup_customer_name: string
  pickup_last_name: string
  pickup_address: string
  pickup_address_2?: string
  pickup_city: string
  pickup_state: string
  pickup_country: string
  pickup_pincode: string
  pickup_email: string
  pickup_phone: string
  shipping_customer_name: string
  shipping_last_name: string
  shipping_address: string
  shipping_address_2?: string
  shipping_city: string
  shipping_state: string
  shipping_country: string
  shipping_pincode: string
  shipping_email: string
  shipping_phone: string
  order_items: ShiprocketOrderItem[]
  payment_method: string
  total_discount: number
  sub_total: number
  length: number
  breadth: number
  height: number
  weight: number
}

class ShiprocketService {
  private static token: string | null = null
  private static tokenExpiry = 0

  // 🔐 Authentication
  static async authenticate(): Promise<string> {
    try {
      // Check if we have a valid token
      if (this.token && Date.now() < this.tokenExpiry) {
        return this.token
      }

      console.log("🔐 Authenticating with Shiprocket...")

      const email = process.env.SHIPROCKET_EMAIL
      const password = process.env.SHIPROCKET_PASSWORD

      if (!email || !password) {
        throw new Error("Shiprocket credentials not configured")
      }

      const response = await fetch(`${SHIPROCKET_BASE_URL}/v1/external/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ Shiprocket authentication failed:", errorText)
        throw new Error(`Authentication failed: ${response.status}`)
      }

      const data: ShiprocketAuthResponse = await response.json()

      this.token = data.token
      this.tokenExpiry = Date.now() + 10 * 60 * 60 * 1000 // 10 hours

      console.log("✅ Shiprocket authentication successful")
      return this.token
    } catch (error: any) {
      console.error("❌ Shiprocket authentication error:", error)
      throw new Error(`Authentication failed: ${error.message}`)
    }
  }

  // 📦 Create Order (Adhoc)
  static async createOrder(orderData: ShiprocketOrder): Promise<any> {
    try {
      const token = await this.authenticate()

      console.log("📦 Creating Shiprocket order:", orderData.order_id)

      const response = await fetch(`${SHIPROCKET_BASE_URL}/v1/external/orders/create/adhoc`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ Order creation failed:", errorText)
        throw new Error(`Order creation failed: ${response.status}`)
      }

      const result = await response.json()
      console.log("✅ Shiprocket order created successfully:", result.order_id)
      return result
    } catch (error: any) {
      console.error("❌ Create order error:", error)
      throw new Error(`Failed to create order: ${error.message}`)
    }
  }

  // 📋 Get Orders
  static async getOrders(page = 1, per_page = 10): Promise<any> {
    try {
      const token = await this.authenticate()

      const response = await fetch(`${SHIPROCKET_BASE_URL}/v1/external/orders?page=${page}&per_page=${per_page}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status}`)
      }

      return await response.json()
    } catch (error: any) {
      console.error("❌ Get orders error:", error)
      throw new Error(`Failed to fetch orders: ${error.message}`)
    }
  }

  // 📋 Get Order Details
  static async getOrderDetails(orderId: string): Promise<any> {
    try {
      const token = await this.authenticate()

      const response = await fetch(`${SHIPROCKET_BASE_URL}/v1/external/orders/show/${orderId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch order details: ${response.status}`)
      }

      return await response.json()
    } catch (error: any) {
      console.error("❌ Get order details error:", error)
      throw new Error(`Failed to fetch order details: ${error.message}`)
    }
  }

  // ❌ Cancel Order
  static async cancelOrder(orderIds: number[]): Promise<any> {
    try {
      const token = await this.authenticate()

      console.log("❌ Cancelling Shiprocket orders:", orderIds)

      const response = await fetch(`${SHIPROCKET_BASE_URL}/v1/external/orders/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ids: orderIds,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ Order cancellation failed:", errorText)
        throw new Error(`Order cancellation failed: ${response.status}`)
      }

      const result = await response.json()
      console.log("✅ Orders cancelled successfully")
      return result
    } catch (error: any) {
      console.error("❌ Cancel order error:", error)
      throw new Error(`Failed to cancel order: ${error.message}`)
    }
  }

  // 📮 Check Serviceability
  static async checkServiceability(request: ShiprocketServiceabilityRequest): Promise<any> {
    try {
      const token = await this.authenticate()

      const response = await fetch(`${SHIPROCKET_BASE_URL}/v1/external/courier/serviceability`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error(`Serviceability check failed: ${response.status}`)
      }

      return await response.json()
    } catch (error: any) {
      console.error("❌ Serviceability check error:", error)
      throw new Error(`Failed to check serviceability: ${error.message}`)
    }
  }

  // 📮 Assign AWB
  static async assignAWB(request: ShiprocketAWBRequest): Promise<any> {
    try {
      const token = await this.authenticate()

      console.log("📮 Assigning AWB for shipment:", request.shipment_id)

      const response = await fetch(`${SHIPROCKET_BASE_URL}/v1/external/courier/assign/awb`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ AWB assignment failed:", errorText)
        throw new Error(`AWB assignment failed: ${response.status}`)
      }

      const result = await response.json()
      console.log("✅ AWB assigned successfully")
      return result
    } catch (error: any) {
      console.error("❌ Assign AWB error:", error)
      throw new Error(`Failed to assign AWB: ${error.message}`)
    }
  }

  // 📍 Track Order
  static async trackOrder(orderId: string): Promise<ShiprocketTrackingResponse> {
    try {
      const token = await this.authenticate()

      const response = await fetch(`${SHIPROCKET_BASE_URL}/v1/external/courier/track?order_id=${orderId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Order tracking failed: ${response.status}`)
      }

      return await response.json()
    } catch (error: any) {
      console.error("❌ Track order error:", error)
      throw new Error(`Failed to track order: ${error.message}`)
    }
  }

  // 🏷️ Generate Label
  static async generateLabel(request: ShiprocketLabelRequest): Promise<any> {
    try {
      const token = await this.authenticate()

      console.log("🏷️ Generating label for shipments:", request.shipment_id)

      const response = await fetch(`${SHIPROCKET_BASE_URL}/v1/external/courier/generate/label`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ Label generation failed:", errorText)
        throw new Error(`Label generation failed: ${response.status}`)
      }

      const result = await response.json()
      console.log("✅ Label generated successfully")
      return result
    } catch (error: any) {
      console.error("❌ Generate label error:", error)
      throw new Error(`Failed to generate label: ${error.message}`)
    }
  }

  // 🏠 Get Pickup Locations
  static async getPickupLocations(): Promise<any> {
    try {
      const token = await this.authenticate()

      const response = await fetch(`${SHIPROCKET_BASE_URL}/v1/external/settings/company/pickup`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch pickup locations: ${response.status}`)
      }

      return await response.json()
    } catch (error: any) {
      console.error("❌ Get pickup locations error:", error)
      throw new Error(`Failed to fetch pickup locations: ${error.message}`)
    }
  }

  // 🔄 Create Return
  static async createReturn(returnData: ShiprocketReturnRequest): Promise<any> {
    try {
      const token = await this.authenticate()

      console.log("🔄 Creating return for order:", returnData.order_id)

      const response = await fetch(`${SHIPROCKET_BASE_URL}/v1/external/orders/create/return`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(returnData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ Return creation failed:", errorText)
        throw new Error(`Return creation failed: ${response.status}`)
      }

      const result = await response.json()
      console.log("✅ Return created successfully")
      return result
    } catch (error: any) {
      console.error("❌ Create return error:", error)
      throw new Error(`Failed to create return: ${error.message}`)
    }
  }

  // 🔄 Cancel RTO
  static async cancelRTO(orderIds: number[]): Promise<any> {
    try {
      const token = await this.authenticate()

      console.log("🔄 Cancelling RTO for orders:", orderIds)

      const response = await fetch(`${SHIPROCKET_BASE_URL}/v1/external/orders/rto/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ids: orderIds,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ RTO cancellation failed:", errorText)
        throw new Error(`RTO cancellation failed: ${response.status}`)
      }

      const result = await response.json()
      console.log("✅ RTO cancelled successfully")
      return result
    } catch (error: any) {
      console.error("❌ Cancel RTO error:", error)
      throw new Error(`Failed to cancel RTO: ${error.message}`)
    }
  }

  // 📊 Get Account Details
  static async getAccountDetails(): Promise<any> {
    try {
      const token = await this.authenticate()

      const response = await fetch(`${SHIPROCKET_BASE_URL}/v1/external/account/details`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch account details: ${response.status}`)
      }

      return await response.json()
    } catch (error: any) {
      console.error("❌ Get account details error:", error)
      throw new Error(`Failed to fetch account details: ${error.message}`)
    }
  }

  // 📊 Get Channels
  static async getChannels(): Promise<any> {
    try {
      const token = await this.authenticate()

      const response = await fetch(`${SHIPROCKET_BASE_URL}/v1/external/channels`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch channels: ${response.status}`)
      }

      return await response.json()
    } catch (error: any) {
      console.error("❌ Get channels error:", error)
      throw new Error(`Failed to fetch channels: ${error.message}`)
    }
  }

  // 📊 Get Manifest
  static async getManifest(shipmentId: string): Promise<any> {
    try {
      const token = await this.authenticate()

      const response = await fetch(`${SHIPROCKET_BASE_URL}/v1/external/manifests/${shipmentId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch manifest: ${response.status}`)
      }

      return await response.json()
    } catch (error: any) {
      console.error("❌ Get manifest error:", error)
      throw new Error(`Failed to fetch manifest: ${error.message}`)
    }
  }
}

export default ShiprocketService
