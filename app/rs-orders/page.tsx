"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Package,
  CheckCircle,
  AlertCircle,
  Truck,
  X,
  Search,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  RefreshCw,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase-client"
import { EmailService } from "@/components/email-service"

interface Order {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string
  total_amount: number
  status: string
  payment_status: string
  created_at: string
  updated_at: string
  order_items?: Array<{
    product_name: string
    quantity: number
    product_price: number
  }>
}

interface StatusUpdateForm {
  orderId: string
  customerName: string
  newStatus: string
}

const statusOptions = [
  { value: "shipped", label: "Shipped", color: "bg-purple-100 text-purple-800" },
  { value: "delivered", label: "Delivered", color: "bg-green-100 text-green-800" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
]

export default function RSOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [statusForm, setStatusForm] = useState<StatusUpdateForm>({
    orderId: "",
    customerName: "",
    newStatus: "",
  })
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchConfirmedOrders()
  }, [])

  useEffect(() => {
    // Filter orders based on search query
    if (searchQuery.trim() === "") {
      setFilteredOrders(orders)
    } else {
      const filtered = orders.filter(
        (order) =>
          order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customer_phone.includes(searchQuery),
      )
      setFilteredOrders(filtered)
    }
  }, [searchQuery, orders])

  const fetchConfirmedOrders = async () => {
    try {
      setLoading(true)
      setError("")

      const supabase = getSupabaseClient()

      // Fetch only confirmed payment orders
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select(`
          id,
          customer_name,
          customer_email,
          customer_phone,
          shipping_address,
          total_amount,
          status,
          payment_status,
          created_at,
          updated_at
        `)
        .eq("payment_status", "completed")
        .in("status", ["confirmed", "shipped", "delivered", "cancelled"])
        .order("created_at", { ascending: false })

      if (ordersError) {
        console.error("❌ Orders fetch error:", ordersError)
        throw ordersError
      }

      console.log("📦 Confirmed orders found:", ordersData?.length || 0)

      if (!ordersData || ordersData.length === 0) {
        setOrders([])
        setFilteredOrders([])
        setLoading(false)
        return
      }

      // Fetch order items for each order
      const ordersWithItems = await Promise.all(
        ordersData.map(async (order) => {
          const { data: itemsData, error: itemsError } = await supabase
            .from("order_items")
            .select(`
              product_name,
              quantity,
              product_price
            `)
            .eq("order_id", order.id)

          if (itemsError) {
            console.error("❌ Order items fetch error for order", order.id, ":", itemsError)
            return { ...order, order_items: [] }
          }

          return { ...order, order_items: itemsData || [] }
        }),
      )

      setOrders(ordersWithItems)
      setFilteredOrders(ordersWithItems)
    } catch (error: any) {
      console.error("❌ Failed to fetch orders:", error)
      setError(`Failed to load orders: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleOrderSelect = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId)
    if (order) {
      setSelectedOrder(order)
      setStatusForm({
        orderId: order.id,
        customerName: order.customer_name,
        newStatus: "",
      })
    }
  }

  const handleStatusUpdate = async () => {
    if (!statusForm.orderId || !statusForm.newStatus) {
      setError("Please select an order and new status")
      return
    }

    if (!selectedOrder) {
      setError("Please select an order first")
      return
    }

    setIsUpdating(true)
    setError("")
    setSuccess("")

    try {
      const supabase = getSupabaseClient()

      // Update order status
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          status: statusForm.newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", statusForm.orderId)

      if (updateError) {
        console.error("❌ Status update error:", updateError)
        throw updateError
      }

      // Send email notification to customer
      const emailResult = await EmailService.sendStatusUpdateNotification({
        orderId: selectedOrder.id,
        customerName: selectedOrder.customer_name,
        customerEmail: selectedOrder.customer_email,
        oldStatus: selectedOrder.status,
        newStatus: statusForm.newStatus,
        orderItems: selectedOrder.order_items || [],
        totalAmount: selectedOrder.total_amount,
      })

      console.log("📧 Email notification result:", emailResult)

      // Refresh orders list
      await fetchConfirmedOrders()

      setSuccess(`Order status updated successfully to "${statusForm.newStatus}". Customer notification email sent.`)
      setStatusForm({ orderId: "", customerName: "", newStatus: "" })
      setSelectedOrder(null)

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(""), 5000)
    } catch (error: any) {
      console.error("❌ Status update failed:", error)
      setError(`Failed to update order status: ${error.message}`)
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
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
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />
      case "shipped":
        return <Truck className="w-4 h-4" />
      case "delivered":
        return <Package className="w-4 h-4" />
      case "cancelled":
        return <X className="w-4 h-4" />
      default:
        return <Package className="w-4 h-4" />
    }
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
              RS Orders Management
            </h1>
            <p className="text-gray-600 mt-2">Update order status for confirmed orders</p>
          </div>
        </motion.div>

        {/* Success/Error Messages */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <Alert className="bg-green-50 border-green-200 rounded-xl">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <Alert variant="destructive" className="rounded-xl">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Status Update Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
            <Card className="bg-white/95 backdrop-blur-md shadow-xl border border-emerald-100 rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Update Order Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Order Selection */}
                <div>
                  <Label htmlFor="order-select" className="text-base font-semibold">
                    Select Order *
                  </Label>
                  <Select onValueChange={handleOrderSelect}>
                    <SelectTrigger className="mt-2 bg-white/80 backdrop-blur-sm border-emerald-200 focus:border-emerald-400 rounded-xl">
                      <SelectValue placeholder="Choose an order to update" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredOrders.length === 0 ? (
                        <SelectItem value="no-orders" disabled>
                          No orders found
                        </SelectItem>
                      ) : (
                        filteredOrders.map((order) => (
                          <SelectItem key={order.id} value={order.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                #{order.id.slice(0, 8)} - {order.customer_name}
                              </span>
                              <span className="text-xs text-gray-500">
                                ₹{order.total_amount.toLocaleString()} • {order.status}
                              </span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Customer Name Display */}
                {selectedOrder && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <Label className="text-base font-semibold">Customer Name</Label>
                    <div className="mt-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{selectedOrder.customer_name}</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* New Status Selection */}
                <div>
                  <Label htmlFor="status-select" className="text-base font-semibold">
                    New Status *
                  </Label>
                  <Select onValueChange={(value) => setStatusForm({ ...statusForm, newStatus: value })}>
                    <SelectTrigger className="mt-2 bg-white/80 backdrop-blur-sm border-emerald-200 focus:border-emerald-400 rounded-xl">
                      <SelectValue placeholder="Select new status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(status.value)}
                            <span>{status.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Selected Order Details */}
                {selectedOrder && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-emerald-50 rounded-xl border border-emerald-200"
                  >
                    <h4 className="font-semibold text-emerald-800 mb-3">Order Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-emerald-600" />
                        <span>Order ID: {selectedOrder.id.slice(0, 8)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-emerald-600" />
                        <span>Amount: ₹{selectedOrder.total_amount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        <span>Date: {new Date(selectedOrder.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getStatusColor(selectedOrder.status)} border px-2 py-1`}>
                          {getStatusIcon(selectedOrder.status)}
                          <span className="ml-1 capitalize">{selectedOrder.status}</span>
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Update Button */}
                <Button
                  onClick={handleStatusUpdate}
                  disabled={isUpdating || !statusForm.orderId || !statusForm.newStatus}
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl py-3 text-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  {isUpdating ? (
                    <div className="flex items-center justify-center">
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Updating Status...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Update Order Status
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Orders List */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
            <Card className="bg-white/95 backdrop-blur-md shadow-xl border border-emerald-100 rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Confirmed Orders ({filteredOrders.length})
                  </span>
                </CardTitle>
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search by Order ID, Customer Name, Email, or Phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-emerald-200 focus:border-emerald-400 rounded-xl"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-12 h-12 border-3 border-emerald-600 border-t-transparent rounded-full mb-4"
                    />
                    <p className="text-gray-600 text-lg">Loading orders...</p>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="text-center py-16">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No Orders Found</h3>
                    <p className="text-gray-500">
                      {searchQuery ? "No orders match your search criteria" : "No confirmed orders available"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {filteredOrders.map((order, index) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-6 border rounded-2xl transition-all duration-300 hover:shadow-lg cursor-pointer ${
                          selectedOrder?.id === order.id
                            ? "border-emerald-300 bg-emerald-50"
                            : "border-gray-200 bg-white hover:border-emerald-200"
                        }`}
                        onClick={() => handleOrderSelect(order.id)}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-3">
                              <div>
                                <h4 className="font-semibold text-gray-800">
                                  Order #{order.id.slice(0, 8).toUpperCase()}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {new Date(order.created_at).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </p>
                              </div>
                              <Badge className={`${getStatusColor(order.status)} border px-3 py-1`}>
                                {getStatusIcon(order.status)}
                                <span className="ml-2 capitalize font-medium">{order.status}</span>
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-gray-500" />
                                  <span className="font-medium">{order.customer_name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4 text-gray-500" />
                                  <span>{order.customer_email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4 text-gray-500" />
                                  <span>{order.customer_phone}</span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                  <MapPin className="w-4 h-4 mt-0.5 text-gray-500" />
                                  <span className="text-xs">{order.shipping_address}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <CreditCard className="w-4 h-4 text-gray-500" />
                                  <span className="font-semibold text-emerald-600">
                                    ₹{order.total_amount.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Order Items Preview */}
                            {order.order_items && order.order_items.length > 0 && (
                              <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                                <p className="text-xs text-gray-600 font-medium mb-2">
                                  Items ({order.order_items.length})
                                </p>
                                <div className="space-y-1">
                                  {order.order_items.slice(0, 2).map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-xs">
                                      <span>
                                        {item.product_name} × {item.quantity}
                                      </span>
                                      <span className="text-emerald-600 font-medium">
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
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
