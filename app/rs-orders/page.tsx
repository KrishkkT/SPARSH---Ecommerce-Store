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
  Search,
  Truck,
  Clock,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase-client"

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
  order_items: Array<{
    product_name: string
    quantity: number
    product_price: number
  }>
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
  const [selectedOrderId, setSelectedOrderId] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    fetchConfirmedOrders()
  }, [])

  useEffect(() => {
    // Filter orders based on search query
    const filtered = orders.filter(
      (order) =>
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer_email.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setFilteredOrders(filtered)
  }, [orders, searchQuery])

  const fetchConfirmedOrders = async () => {
    try {
      setLoading(true)
      setError("")

      const supabase = getSupabaseClient()

      // Fetch only confirmed orders with completed payments
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
          created_at
        `)
        .eq("payment_status", "completed")
        .eq("status", "confirmed")
        .order("created_at", { ascending: false })

      if (ordersError) {
        throw ordersError
      }

      // Fetch order items for each order
      const ordersWithItems = await Promise.all(
        (ordersData || []).map(async (order) => {
          const { data: itemsData, error: itemsError } = await supabase
            .from("order_items")
            .select(`
              product_name,
              quantity,
              product_price
            `)
            .eq("order_id", order.id)

          if (itemsError) {
            console.error("Error fetching items for order", order.id, ":", itemsError)
            return { ...order, order_items: [] }
          }

          return { ...order, order_items: itemsData || [] }
        }),
      )

      setOrders(ordersWithItems)
      setFilteredOrders(ordersWithItems)
    } catch (error: any) {
      console.error("Failed to fetch orders:", error)
      setError(`Failed to load orders: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleOrderSelect = (orderId: string) => {
    setSelectedOrderId(orderId)
    const order = orders.find((o) => o.id === orderId)
    setSelectedOrder(order || null)
  }

  const handleStatusUpdate = async () => {
    if (!selectedOrderId || !selectedStatus) {
      setError("Please select both an order and a status")
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
          status: selectedStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedOrderId)

      if (updateError) {
        throw updateError
      }

      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.id === selectedOrderId ? { ...order, status: selectedStatus } : order)),
      )

      setSuccess(`Order status updated to ${selectedStatus} successfully!`)
      setSelectedOrderId("")
      setSelectedStatus("")
      setSelectedOrder(null)

      // Refresh the orders list to remove updated order from confirmed list
      setTimeout(() => {
        fetchConfirmedOrders()
        setSuccess("")
      }, 2000)
    } catch (error: any) {
      console.error("Failed to update order status:", error)
      setError(`Failed to update order status: ${error.message}`)
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
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
          {/* Order Update Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="bg-white/95 backdrop-blur-md shadow-xl border border-emerald-100 rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Update Order Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search Orders */}
                <div>
                  <Label htmlFor="search" className="text-base font-semibold">
                    Search Orders
                  </Label>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="search"
                      type="text"
                      placeholder="Search by Order ID, Customer Name, or Email"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 border-emerald-200 focus:border-emerald-400 rounded-xl"
                    />
                  </div>
                </div>

                {/* Order Selection */}
                <div>
                  <Label htmlFor="order-select" className="text-base font-semibold">
                    Select Order *
                  </Label>
                  <Select onValueChange={handleOrderSelect} value={selectedOrderId}>
                    <SelectTrigger className="mt-2 bg-white/80 backdrop-blur-sm border-emerald-200 focus:border-emerald-400 rounded-xl">
                      <SelectValue placeholder="Choose an order to update" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredOrders.length === 0 ? (
                        <SelectItem value="no-orders" disabled>
                          {loading ? "Loading orders..." : "No confirmed orders found"}
                        </SelectItem>
                      ) : (
                        filteredOrders.map((order) => (
                          <SelectItem key={order.id} value={order.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                #{order.id.slice(0, 8)} - {order.customer_name}
                              </span>
                              <span className="text-xs text-gray-500">
                                ₹{order.total_amount.toLocaleString()} •{" "}
                                {new Date(order.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Selection */}
                <div>
                  <Label htmlFor="status-select" className="text-base font-semibold">
                    New Status *
                  </Label>
                  <Select onValueChange={setSelectedStatus} value={selectedStatus}>
                    <SelectTrigger className="mt-2 bg-white/80 backdrop-blur-sm border-emerald-200 focus:border-emerald-400 rounded-xl">
                      <SelectValue placeholder="Select new status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          <div className="flex items-center gap-2">
                            <Badge className={status.color}>{status.label}</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Update Button */}
                <Button
                  onClick={handleStatusUpdate}
                  disabled={isUpdating || !selectedOrderId || !selectedStatus}
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl py-3 text-lg font-semibold shadow-lg transition-all duration-300"
                >
                  {isUpdating ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Updating...
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

            {/* Selected Order Details */}
            {selectedOrder && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                <Card className="bg-white/95 backdrop-blur-md shadow-lg border border-emerald-100 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-lg">Selected Order Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-emerald-500" />
                      <span className="font-medium">{selectedOrder.customer_name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm">{selectedOrder.customer_email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm">{selectedOrder.customer_phone}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 mt-0.5 text-emerald-500" />
                      <span className="text-sm">{selectedOrder.shipping_address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-4 h-4 text-emerald-500" />
                      <span className="font-bold text-emerald-600">₹{selectedOrder.total_amount.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>

          {/* Orders List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="bg-white/95 backdrop-blur-md shadow-xl border border-emerald-100 rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Confirmed Orders ({filteredOrders.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-3 border-emerald-600 border-t-transparent mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading orders...</p>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="text-center py-16">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No Confirmed Orders</h3>
                    <p className="text-gray-500">
                      {searchQuery ? "No orders match your search criteria" : "No confirmed orders found"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {filteredOrders.map((order, index) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`border rounded-2xl p-6 transition-all duration-300 cursor-pointer ${
                          selectedOrderId === order.id
                            ? "border-emerald-300 bg-emerald-50 shadow-lg"
                            : "border-gray-200 hover:border-emerald-200 hover:shadow-md"
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
                                  {order.customer_name} • {order.customer_email}
                                </p>
                                <div className="flex items-center text-gray-600 text-sm mt-1">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {new Date(order.created_at).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </div>
                              </div>
                              <Badge className={`${getStatusColor(order.status)} border px-3 py-1`}>
                                {getStatusIcon(order.status)}
                                <span className="ml-2 capitalize font-medium">{order.status}</span>
                              </Badge>
                            </div>

                            {order.order_items && order.order_items.length > 0 && (
                              <div className="space-y-1">
                                {order.order_items.slice(0, 2).map((item, idx) => (
                                  <div key={idx} className="flex justify-between text-sm text-gray-600">
                                    <span>
                                      {item.product_name} × {item.quantity}
                                    </span>
                                    <span>₹{(item.product_price * item.quantity).toLocaleString()}</span>
                                  </div>
                                ))}
                                {order.order_items.length > 2 && (
                                  <p className="text-sm text-gray-500">+{order.order_items.length - 2} more items</p>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="text-right">
                            <p className="text-2xl font-bold text-emerald-600">
                              ₹{order.total_amount.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">Total Amount</p>
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
