"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Package, Truck, CheckCircle, Clock, X, AlertCircle, Eye, Download } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

// Safe Supabase import
let supabase: any = null
try {
  const { supabase: supabaseClient } = require("@/lib/supabase")
  supabase = supabaseClient
} catch (error) {
  console.warn("Supabase not configured, running in demo mode")
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
  order_items?: Array<{
    id: string
    product_name: string
    product_price: number
    quantity: number
  }>
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      window.location.href = "/login"
      return
    }
    fetchOrders()
  }, [user, router])

  const fetchOrders = async () => {
    if (!supabase || !user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (*)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      setOrders(data || [])
    } catch (error: any) {
      console.error("Error fetching orders:", error)
      setError("Failed to load orders. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
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

  const trackShipment = async (orderId: string) => {
    try {
      const response = await fetch(`/api/shiprocket/track?order_id=${orderId}`)
      const data = await response.json()

      if (data.success) {
        console.log("Tracking data:", data.data)
        // You can add a tracking modal here
      }
    } catch (error) {
      console.error("Tracking error:", error)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mr-4 hover:bg-emerald-100 rounded-xl">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <motion.h1
            className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            My Orders
          </motion.h1>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full"
            />
          </div>
        ) : orders.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">No Orders Yet</h2>
            <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
            <Button
              onClick={() => (window.location.href = "/")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Start Shopping
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/95 backdrop-blur-md shadow-lg border border-emerald-100 rounded-2xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">Order #{order.id.slice(0, 8)}</h3>
                            <p className="text-sm text-gray-600">
                              Placed on {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1 capitalize">{order.status}</span>
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Total Amount</p>
                            <p className="text-xl font-bold text-emerald-600">₹{order.total_amount.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Payment Status</p>
                            <Badge
                              className={
                                order.payment_status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : order.payment_status === "failed"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {order.payment_status}
                            </Badge>
                          </div>
                        </div>

                        {order.order_items && order.order_items.length > 0 && (
                          <div>
                            <p className="text-sm text-gray-600 mb-2">Items ({order.order_items.length})</p>
                            <div className="space-y-2">
                              {order.order_items.slice(0, 2).map((item) => (
                                <div key={item.id} className="flex justify-between text-sm">
                                  <span>
                                    {item.product_name} x {item.quantity}
                                  </span>
                                  <span>₹{(item.product_price * item.quantity).toLocaleString()}</span>
                                </div>
                              ))}
                              {order.order_items.length > 2 && (
                                <p className="text-sm text-gray-500">+{order.order_items.length - 2} more items</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setSelectedOrder(order)}
                          className="border-emerald-200 hover:bg-emerald-50"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        {order.status === "delivered" && (
                          <Button variant="outline" className="border-emerald-200 hover:bg-emerald-50">
                            <Download className="w-4 h-4 mr-2" />
                            Download Invoice
                          </Button>
                        )}
                        {order.status === "shipped" && (
                          <Button
                            variant="outline"
                            onClick={() => trackShipment(order.id)}
                            className="border-emerald-200 hover:bg-emerald-50"
                          >
                            <Truck className="w-4 h-4 mr-2" />
                            Track Shipment
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Order Details</h2>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(null)}>
                    <X className="w-6 h-6" />
                  </Button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Order Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Order Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Order ID</p>
                      <p className="font-medium">{selectedOrder.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Order Date</p>
                      <p className="font-medium">{new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <Badge className={getStatusColor(selectedOrder.status)}>
                        {getStatusIcon(selectedOrder.status)}
                        <span className="ml-1 capitalize">{selectedOrder.status}</span>
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Status</p>
                      <Badge
                        className={
                          selectedOrder.payment_status === "completed"
                            ? "bg-green-100 text-green-800"
                            : selectedOrder.payment_status === "failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {selectedOrder.payment_status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">{selectedOrder.customer_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{selectedOrder.customer_email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{selectedOrder.customer_phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Shipping Address</p>
                      <p className="font-medium">{selectedOrder.shipping_address}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                {selectedOrder.order_items && selectedOrder.order_items.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                    <div className="space-y-3">
                      {selectedOrder.order_items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                          <div>
                            <p className="font-medium">{item.product_name}</p>
                            <p className="text-sm text-gray-600">
                              ₹{item.product_price.toLocaleString()} x {item.quantity}
                            </p>
                          </div>
                          <p className="font-bold text-emerald-600">
                            ₹{(item.product_price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-4 bg-emerald-50 rounded-xl">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Total Amount</span>
                        <span className="text-2xl font-bold text-emerald-600">
                          ₹{selectedOrder.total_amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
