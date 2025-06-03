"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  X,
  AlertCircle,
  Eye,
  Download,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  FileText,
  ShoppingBag,
  Loader2,
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { getSupabaseClient } from "@/lib/supabase-client"

interface OrderItem {
  id: string
  product_name: string
  product_price: number
  quantity: number
  subtotal?: number
}

interface Order {
  id: string
  total_amount: number
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string
  created_at: string
  updated_at: string
  payment_status: "pending" | "completed" | "failed" | "refunded"
  payment_method: string | null
  shiprocket_order_id?: string
  tracking_number?: string
  invoice_url?: string
  order_items?: OrderItem[]
}

interface ShiprocketTracking {
  track_status: number
  shipment_status: string
  shipment_track: Array<{
    date: string
    status: string
    activity: string
    location: string
  }>
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [trackingData, setTrackingData] = useState<ShiprocketTracking | null>(null)
  const [trackingLoading, setTrackingLoading] = useState(false)
  const [downloadingInvoice, setDownloadingInvoice] = useState<string | null>(null)

  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderIdFromUrl = searchParams.get("orderId")

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login?redirect=/orders")
        return
      }
      fetchOrders()
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (orderIdFromUrl && orders.length > 0) {
      const order = orders.find((o) => o.id === orderIdFromUrl)
      if (order) {
        setSelectedOrder(order)
      }
    }
  }, [orderIdFromUrl, orders])

  const fetchOrders = async () => {
    if (!user) {
      setOrders([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError("")

      console.log("🔍 Fetching orders for user:", user.id)

      const supabase = getSupabaseClient()

      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select(`
          id,
          total_amount,
          status,
          customer_name,
          customer_email,
          customer_phone,
          shipping_address,
          created_at,
          updated_at,
          payment_status,
          payment_method,
          shiprocket_order_id,
          tracking_number,
          invoice_url,
          user_id
        `)
        .eq("user_id", user.id)
        .eq("payment_status", "completed")
        .in("status", ["confirmed", "shipped", "delivered", "cancelled"])
        .order("created_at", { ascending: false })

      if (ordersError) {
        console.error("❌ Orders fetch error:", ordersError)
        throw ordersError
      }

      console.log("📦 Orders found:", ordersData?.length || 0)

      if (!ordersData || ordersData.length === 0) {
        console.log("📭 No orders found for user")
        setOrders([])
        setLoading(false)
        return
      }

      const ordersWithItems = await Promise.all(
        ordersData.map(async (order) => {
          const { data: itemsData, error: itemsError } = await supabase
            .from("order_items")
            .select(`
              id,
              product_name,
              product_price,
              quantity
            `)
            .eq("order_id", order.id)

          if (itemsError) {
            console.error("❌ Order items fetch error for order", order.id, ":", itemsError)
            return { ...order, order_items: [] }
          }

          console.log("📋 Items for order", order.id, ":", itemsData?.length || 0)
          return { ...order, order_items: itemsData || [] }
        }),
      )

      console.log("✅ Orders with items loaded:", ordersWithItems.length)
      setOrders(ordersWithItems)
    } catch (error: any) {
      console.error("❌ Failed to fetch orders:", error)
      setError(`Failed to load orders: ${error.message}`)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />
      case "shipped":
        return <Truck className="w-4 h-4" />
      case "delivered":
        return <Package className="w-4 h-4" />
      case "cancelled":
        return <X className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "failed":
        return "bg-red-100 text-red-800 border-red-200"
      case "refunded":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Check if order is eligible for invoice download
  const canDownloadInvoice = (order: Order) => {
    return order.payment_status === "completed" || order.status === "confirmed" || order.status === "delivered"
  }

  const trackShipment = async (orderId: string) => {
    if (!orderId) return

    try {
      setTrackingLoading(true)
      const response = await fetch(`/api/shiprocket/track?order_id=${orderId}`)
      const data = await response.json()

      if (data.success && data.data.tracking_data) {
        setTrackingData(data.data.tracking_data)
      } else {
        setError("Tracking information not available")
      }
    } catch (error) {
      setError("Failed to track shipment")
    } finally {
      setTrackingLoading(false)
    }
  }

  // Find the downloadInvoice function and update it to handle errors better
  const downloadInvoice = async (orderId: string) => {
    try {
      setDownloadingInvoice(orderId)

      // Create a more robust download approach
      const response = await fetch(`/api/orders/${orderId}/invoice`, {
        method: "GET",
        headers: {
          Accept: "application/pdf",
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("❌ Invoice download failed:", errorData)
        throw new Error(errorData.error || `Failed to generate invoice (${response.status})`)
      }

      // Get the blob and create download
      const blob = await response.blob()

      // Verify it's actually a PDF
      if (blob.type !== "application/pdf" && !blob.type.includes("pdf")) {
        throw new Error("Invalid file type received")
      }

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = `SPARSH-Invoice-${orderId.slice(0, 8)}.pdf`
      a.target = "_blank" // Open in new tab as fallback

      document.body.appendChild(a)
      a.click()

      // Cleanup
      setTimeout(() => {
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }, 100)

      // Show success message
      setError("")

      // Refresh order data to get updated invoice URL
      await fetchOrders()
    } catch (error: any) {
      console.error("❌ Invoice download error:", error)
      setError(
        `Failed to download invoice: ${error.message}. Please contact SPARSH at rs.sparshnaturals@gmail.com to receive your invoice.`,
      )
    } finally {
      setDownloadingInvoice(null)
    }
  }

  // Add this function to generate invoice if it doesn't exist
  const generateInvoice = async (orderId: string) => {
    try {
      setDownloadingInvoice(orderId)

      // First try to generate the invoice
      const generateResponse = await fetch(`/api/orders/${orderId}/generate-invoice`, {
        method: "POST",
      })

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to generate invoice (${generateResponse.status})`)
      }

      const generateData = await generateResponse.json()

      if (generateData.success) {
        // Now download the invoice
        await downloadInvoice(orderId)
      } else {
        throw new Error(generateData.error || "Failed to generate invoice")
      }
    } catch (error: any) {
      console.error("❌ Invoice generation error:", error)
      setError(`Failed to generate invoice: ${error.message}`)
    } finally {
      setDownloadingInvoice(null)
    }
  }

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.set("orderId", order.id)
    window.history.pushState({}, "", newUrl.toString())
  }

  const handleCloseDetails = () => {
    setSelectedOrder(null)
    setTrackingData(null)
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.delete("orderId")
    window.history.pushState({}, "", newUrl.toString())
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-12 h-12 border-3 border-emerald-600 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (!user && !loading) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mr-4 hover:bg-emerald-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              My Orders
            </h1>
            <p className="text-gray-600 mt-2">Track and manage your SPARSH orders</p>
          </div>
        </motion.div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="w-12 h-12 border-3 border-emerald-600 border-t-transparent rounded-full mb-4"
            />
            <p className="text-gray-600 text-lg">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-12 max-w-md mx-auto">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">No Orders Found</h2>
              <p className="text-gray-600 mb-8">
                You haven't placed any orders yet. Start shopping to see your orders here.
              </p>
              <Button
                onClick={() => router.push("/")}
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-8 py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Start Shopping
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <div className="mb-6">
              <p className="text-gray-600 text-lg">
                Found <span className="font-semibold text-emerald-600">{orders.length}</span> order
                {orders.length !== 1 ? "s" : ""}
              </p>
            </div>

            <AnimatePresence>
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white/90 backdrop-blur-md shadow-xl border border-emerald-100 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                    <CardContent className="p-8">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        <div className="flex-1 space-y-6">
                          {/* Order Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                              <h3 className="text-xl font-bold text-gray-800 mb-1">
                                Order #{order.id.slice(0, 8).toUpperCase()}
                              </h3>
                              <div className="flex items-center text-gray-600 text-sm">
                                <Calendar className="w-4 h-4 mr-2" />
                                Placed on{" "}
                                {new Date(order.created_at).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </div>
                              {order.tracking_number && (
                                <div className="flex items-center text-blue-600 text-sm mt-1">
                                  <Truck className="w-4 h-4 mr-2" />
                                  Tracking: {order.tracking_number}
                                </div>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Badge className={`${getStatusColor(order.status)} border px-3 py-1`}>
                                {getStatusIcon(order.status)}
                                <span className="ml-2 capitalize font-medium">{order.status}</span>
                              </Badge>
                              <Badge className={`${getPaymentStatusColor(order.payment_status)} border px-3 py-1`}>
                                <CreditCard className="w-4 h-4 mr-2" />
                                <span className="capitalize font-medium">{order.payment_status}</span>
                              </Badge>
                            </div>
                          </div>

                          {/* Order Summary */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-emerald-50 rounded-2xl p-4">
                              <p className="text-sm text-emerald-700 font-medium mb-1">Total Amount</p>
                              <p className="text-2xl font-bold text-emerald-800">
                                ₹{order.total_amount.toLocaleString()}
                              </p>
                            </div>
                            <div className="bg-gray-50 rounded-2xl p-4">
                              <p className="text-sm text-gray-600 font-medium mb-1">Payment Method</p>
                              <p className="text-lg font-semibold text-gray-800">
                                {order.payment_method || "Online Payment"}
                              </p>
                            </div>
                          </div>

                          {/* Order Items Preview */}
                          {order.order_items && order.order_items.length > 0 && (
                            <div className="bg-gray-50 rounded-2xl p-4">
                              <p className="text-sm text-gray-600 font-medium mb-3">
                                Items ({order.order_items.length})
                              </p>
                              <div className="space-y-2">
                                {order.order_items.slice(0, 2).map((item) => (
                                  <div key={item.id} className="flex justify-between items-center text-sm">
                                    <span className="text-gray-800 font-medium">
                                      {item.product_name} × {item.quantity}
                                    </span>
                                    <span className="text-emerald-600 font-semibold">
                                      ₹{(item.product_price * item.quantity).toLocaleString()}
                                    </span>
                                  </div>
                                ))}
                                {order.order_items.length > 2 && (
                                  <p className="text-xs text-gray-500 italic">
                                    +{order.order_items.length - 2} more items
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 min-w-[200px]">
                          <Button
                            variant="outline"
                            onClick={() => handleViewDetails(order)}
                            className="border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 rounded-xl transition-all duration-300"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>

                          {/* Conditional Invoice Download Button */}
                          {canDownloadInvoice(order) && (
                            <Button
                              onClick={() => downloadInvoice(order.id)}
                              disabled={downloadingInvoice === order.id}
                              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                            >
                              {downloadingInvoice === order.id ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <Download className="w-4 h-4 mr-2" />
                                  Download Invoice
                                </>
                              )}
                            </Button>
                          )}

                          {(order.status === "shipped" || order.status === "delivered") &&
                            order.shiprocket_order_id && (
                              <Button
                                variant="outline"
                                onClick={() => trackShipment(order.shiprocket_order_id!)}
                                disabled={trackingLoading}
                                className="border-blue-200 hover:bg-blue-50 hover:border-blue-300 rounded-xl transition-all duration-300"
                              >
                                {trackingLoading ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Loading...
                                  </>
                                ) : (
                                  <>
                                    <Truck className="w-4 h-4 mr-2" />
                                    Track Shipment
                                  </>
                                )}
                              </Button>
                            )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Order Details Modal */}
        <AnimatePresence>
          {selectedOrder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={handleCloseDetails}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-3xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
                      <p className="text-gray-600">#{selectedOrder.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleCloseDetails} className="rounded-full">
                      <X className="w-6 h-6" />
                    </Button>
                  </div>
                </div>

                <div className="p-6 space-y-8">
                  {/* Order Information */}
                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold mb-4 text-emerald-800">Order Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-600 font-medium">Order ID</p>
                          <p className="text-gray-800 font-semibold">{selectedOrder.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 font-medium">Order Date</p>
                          <p className="text-gray-800 font-semibold">
                            {new Date(selectedOrder.created_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 font-medium">Status</p>
                          <Badge className={`${getStatusColor(selectedOrder.status)} border mt-1`}>
                            {getStatusIcon(selectedOrder.status)}
                            <span className="ml-2 capitalize">{selectedOrder.status}</span>
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-600 font-medium">Payment Status</p>
                          <Badge className={`${getPaymentStatusColor(selectedOrder.payment_status)} border mt-1`}>
                            <CreditCard className="w-4 h-4 mr-2" />
                            {selectedOrder.payment_status}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 font-medium">Payment Method</p>
                          <p className="text-gray-800 font-semibold">
                            {selectedOrder.payment_method || "Online Payment"}
                          </p>
                        </div>
                        {selectedOrder.tracking_number && (
                          <div>
                            <p className="text-sm text-gray-600 font-medium">Tracking Number</p>
                            <p className="text-blue-600 font-semibold">{selectedOrder.tracking_number}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Customer Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-gray-500" />
                        <span className="font-medium text-gray-800">{selectedOrder.customer_name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-500" />
                        <span className="font-medium text-gray-800">{selectedOrder.customer_email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-500" />
                        <span className="font-medium text-gray-800">{selectedOrder.customer_phone}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 mt-0.5 text-gray-500" />
                        <span className="font-medium text-gray-800">{selectedOrder.shipping_address}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  {selectedOrder.order_items && selectedOrder.order_items.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-gray-800">Order Items</h3>
                      <div className="space-y-3">
                        {selectedOrder.order_items.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                <Package className="w-6 h-6 text-emerald-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800">{item.product_name}</p>
                                <p className="text-sm text-gray-600">
                                  ₹{item.product_price.toLocaleString()} × {item.quantity}
                                </p>
                              </div>
                            </div>
                            <p className="font-bold text-emerald-600 text-lg">
                              ₹{(item.product_price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl">
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-semibold text-gray-800">Total Amount</span>
                          <span className="text-3xl font-bold text-emerald-600">
                            ₹{selectedOrder.total_amount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tracking Information */}
                  {trackingData && (
                    <div className="bg-blue-50 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold mb-4 text-blue-800">Tracking Information</h3>
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-100 rounded-xl">
                          <p className="font-semibold text-blue-800">Status: {trackingData.shipment_status}</p>
                        </div>
                        {trackingData.shipment_track && trackingData.shipment_track.length > 0 && (
                          <div className="space-y-3">
                            {trackingData.shipment_track.map((track, index) => (
                              <div key={index} className="flex justify-between items-start p-4 bg-white rounded-xl">
                                <div>
                                  <p className="font-medium text-gray-800">{track.activity}</p>
                                  <p className="text-sm text-gray-600">{track.location}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium text-gray-800">{track.status}</p>
                                  <p className="text-xs text-gray-500">{new Date(track.date).toLocaleString()}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons in Modal */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                    {canDownloadInvoice(selectedOrder) && (
                      <Button
                        onClick={() => downloadInvoice(selectedOrder.id)}
                        disabled={downloadingInvoice === selectedOrder.id}
                        className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl shadow-lg transition-all duration-300"
                      >
                        {downloadingInvoice === selectedOrder.id ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Generating Invoice...
                          </>
                        ) : (
                          <>
                            <FileText className="w-4 h-4 mr-2" />
                            Download Invoice
                          </>
                        )}
                      </Button>
                    )}
                    {(selectedOrder.status === "shipped" || selectedOrder.status === "delivered") &&
                      selectedOrder.shiprocket_order_id && (
                        <Button
                          variant="outline"
                          onClick={() => trackShipment(selectedOrder.shiprocket_order_id!)}
                          disabled={trackingLoading}
                          className="border-blue-200 hover:bg-blue-50 rounded-xl"
                        >
                          {trackingLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Loading...
                            </>
                          ) : (
                            <>
                              <Truck className="w-4 h-4 mr-2" />
                              Track Shipment
                            </>
                          )}
                        </Button>
                      )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
