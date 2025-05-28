"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  User,
  Edit,
  Save,
  X,
  Package,
  LogOut,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ArrowLeft,
  Settings,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/lib/supabase"

interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  address: string | null
  created_at: string
  updated_at: string
}

interface Order {
  id: string
  total_amount: number
  status: string
  payment_status: string
  created_at: string
  order_items: {
    product_name: string
    quantity: number
    product_price: number
  }[]
}

interface OrderStats {
  total: number
  confirmed: number
  cancelled: number
  delivered: number
  pending: number
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
}

export default function ProfilePage() {
  const { user, signOut, updateProfile, getProfile, loading: authLoading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [orderStats, setOrderStats] = useState<OrderStats>({
    total: 0,
    confirmed: 0,
    cancelled: 0,
    delivered: 0,
    pending: 0,
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setSaving] = useState(false)
  const [editForm, setEditForm] = useState({
    full_name: "",
    phone: "",
    address: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [activeTab, setActiveTab] = useState("profile")

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login")
        return
      }
      loadProfile()
      loadOrders()
    }
  }, [user, authLoading, router])

  const loadProfile = async () => {
    try {
      const profileData = await getProfile()
      setProfile(profileData)
      setEditForm({
        full_name: profileData.full_name || "",
        phone: profileData.phone || "",
        address: profileData.address || "",
      })
    } catch (error) {
      console.error("Failed to load profile:", error)
    }
  }

  const loadOrders = async () => {
    if (!user) return

    try {
      const { data: ordersData, error } = await supabase
        .from("orders")
        .select(`
          id,
          total_amount,
          status,
          payment_status,
          created_at,
          order_items (
            product_name,
            quantity,
            product_price
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error

      const orders = ordersData || []
      setOrders(orders)

      // Calculate order statistics
      const stats = orders.reduce(
        (acc, order) => {
          acc.total++
          switch (order.status) {
            case "confirmed":
              acc.confirmed++
              break
            case "cancelled":
              acc.cancelled++
              break
            case "delivered":
              acc.delivered++
              break
            case "pending":
              acc.pending++
              break
          }
          return acc
        },
        { total: 0, confirmed: 0, cancelled: 0, delivered: 0, pending: 0 },
      )

      setOrderStats(stats)
    } catch (error) {
      console.error("Failed to load orders:", error)
    }
  }

  const handleSaveProfile = async () => {
    setError("")
    setSuccess("")
    setSaving(true)

    try {
      await updateProfile(editForm)
      await loadProfile()
      setIsEditing(false)
      setSuccess("Profile updated successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (error: any) {
      setError(error.message || "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
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

  const getTotalSpent = () => {
    return orders
      .filter((order) => order.payment_status === "completed")
      .reduce((total, order) => total + order.total_amount, 0)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md shadow-lg border-b border-emerald-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.back()} className="hover:bg-emerald-100 rounded-xl">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
              <motion.h1
                className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                My Account
              </motion.h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={handleLogout} className="border-red-300 text-red-600 hover:bg-red-50">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
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
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-4 gap-8"
        >
          {/* Profile Card - Left Side */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <Card className="bg-white/95 backdrop-blur-md shadow-xl border-0 rounded-3xl overflow-hidden">
              <CardContent className="p-0">
                {/* Profile Header with Gradient */}
                <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-8 text-white text-center relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 opacity-20"
                    animate={{
                      background: [
                        "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)",
                        "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)",
                        "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)",
                      ],
                    }}
                    transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                  />
                  <motion.div
                    className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 relative z-10"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <User className="w-12 h-12 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-1 relative z-10">{profile?.full_name || "User"}</h3>
                  <p className="text-emerald-100 text-sm relative z-10">{profile?.email}</p>
                  <div className="flex items-center justify-center gap-2 mt-3 text-sm text-emerald-100 relative z-10">
                    <Calendar className="w-4 h-4" />
                    <span>Since {new Date(profile?.created_at || "").toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Enhanced Stats Section */}
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <motion.div className="text-center p-3 bg-emerald-50 rounded-xl" whileHover={{ scale: 1.02 }}>
                      <div className="text-lg font-bold text-emerald-600">{orderStats.total}</div>
                      <div className="text-xs text-gray-600">Total Orders</div>
                    </motion.div>
                    <motion.div className="text-center p-3 bg-green-50 rounded-xl" whileHover={{ scale: 1.02 }}>
                      <div className="text-lg font-bold text-green-600">₹{getTotalSpent().toLocaleString()}</div>
                      <div className="text-xs text-gray-600">Total Spent</div>
                    </motion.div>
                    <motion.div className="text-center p-3 bg-blue-50 rounded-xl" whileHover={{ scale: 1.02 }}>
                      <div className="text-lg font-bold text-blue-600">{orderStats.confirmed}</div>
                      <div className="text-xs text-gray-600">Confirmed</div>
                    </motion.div>
                    <motion.div className="text-center p-3 bg-green-50 rounded-xl" whileHover={{ scale: 1.02 }}>
                      <div className="text-lg font-bold text-green-600">{orderStats.delivered}</div>
                      <div className="text-xs text-gray-600">Delivered</div>
                    </motion.div>
                    <motion.div className="text-center p-3 bg-yellow-50 rounded-xl" whileHover={{ scale: 1.02 }}>
                      <div className="text-lg font-bold text-yellow-600">{orderStats.pending}</div>
                      <div className="text-xs text-gray-600">Pending</div>
                    </motion.div>
                    <motion.div className="text-center p-3 bg-red-50 rounded-xl" whileHover={{ scale: 1.02 }}>
                      <div className="text-lg font-bold text-red-600">{orderStats.cancelled}</div>
                      <div className="text-xs text-gray-600">Cancelled</div>
                    </motion.div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Mail className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm">{profile?.email}</span>
                    </div>
                    {profile?.phone && (
                      <div className="flex items-center gap-3 text-gray-600">
                        <Phone className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm">{profile.phone}</span>
                      </div>
                    )}
                    {profile?.address && (
                      <div className="flex items-start gap-3 text-gray-600">
                        <MapPin className="w-4 h-4 mt-0.5 text-emerald-500" />
                        <span className="text-sm">{profile.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content - Right Side */}
          <motion.div variants={itemVariants} className="lg:col-span-3">
            {/* Tab Navigation */}
            <div className="mb-6">
              <div className="flex space-x-1 bg-white/80 backdrop-blur-sm p-1 rounded-2xl shadow-lg">
                {[
                  { id: "profile", label: "Profile Settings", icon: Settings },
                  { id: "orders", label: "Order History", icon: Package },
                ].map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all flex-1 justify-center ${
                      activeTab === tab.id ? "bg-emerald-600 text-white shadow-lg" : "text-gray-600 hover:bg-emerald-50"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-white/95 backdrop-blur-md shadow-xl border-0 rounded-3xl">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Settings className="w-5 h-5" />
                          Profile Settings
                        </span>
                        {!isEditing && (
                          <Button
                            onClick={() => setIsEditing(true)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Profile
                          </Button>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {!isEditing ? (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Full Name</Label>
                              <div className="mt-1 p-3 bg-gray-50 rounded-xl">
                                {profile?.full_name || "Not provided"}
                              </div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Email</Label>
                              <div className="mt-1 p-3 bg-gray-50 rounded-xl">{profile?.email}</div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Phone Number</Label>
                              <div className="mt-1 p-3 bg-gray-50 rounded-xl">{profile?.phone || "Not provided"}</div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-700">Member Since</Label>
                              <div className="mt-1 p-3 bg-gray-50 rounded-xl">
                                {new Date(profile?.created_at || "").toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Address</Label>
                            <div className="mt-1 p-3 bg-gray-50 rounded-xl min-h-[80px]">
                              {profile?.address || "Not provided"}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <Label htmlFor="full_name" className="text-sm font-medium text-gray-700">
                                Full Name
                              </Label>
                              <Input
                                id="full_name"
                                value={editForm.full_name}
                                onChange={(e) => setEditForm((prev) => ({ ...prev, full_name: e.target.value }))}
                                className="mt-1 border-emerald-200 focus:border-emerald-400 rounded-xl"
                                placeholder="Enter your full name"
                              />
                            </div>
                            <div>
                              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                                Phone Number
                              </Label>
                              <Input
                                id="phone"
                                value={editForm.phone}
                                onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))}
                                className="mt-1 border-emerald-200 focus:border-emerald-400 rounded-xl"
                                placeholder="Enter your phone number"
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                              Address
                            </Label>
                            <Textarea
                              id="address"
                              value={editForm.address}
                              onChange={(e) => setEditForm((prev) => ({ ...prev, address: e.target.value }))}
                              className="mt-1 border-emerald-200 focus:border-emerald-400 rounded-xl"
                              placeholder="Enter your address"
                              rows={4}
                            />
                          </div>
                          <div className="flex gap-3">
                            <Button
                              onClick={handleSaveProfile}
                              disabled={isSaving}
                              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              <Save className="w-4 h-4 mr-2" />
                              {isSaving ? "Saving..." : "Save Changes"}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setIsEditing(false)
                                setEditForm({
                                  full_name: profile?.full_name || "",
                                  phone: profile?.phone || "",
                                  address: profile?.address || "",
                                })
                              }}
                              className="flex-1 border-gray-300"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Cancel
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {activeTab === "orders" && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-white/95 backdrop-blur-md shadow-xl border-0 rounded-3xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Order History ({orders.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {orders.length === 0 ? (
                        <motion.div
                          className="text-center py-12"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-600 mb-2">No orders yet</h3>
                          <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
                          <Button
                            onClick={() => router.push("/orders")}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            View All Orders
                          </Button>
                        </motion.div>
                      ) : (
                        <div className="space-y-4">
                          {orders.slice(0, 5).map((order, index) => (
                            <motion.div
                              key={order.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white to-gray-50"
                            >
                              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-4 mb-3">
                                    <div>
                                      <h4 className="font-semibold text-gray-800">Order #{order.id.slice(0, 8)}</h4>
                                      <p className="text-sm text-gray-600">
                                        {new Date(order.created_at).toLocaleDateString()}
                                      </p>
                                    </div>
                                    <div className="flex gap-2">
                                      <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                                      <Badge className={getStatusColor(order.payment_status)}>
                                        {order.payment_status}
                                      </Badge>
                                    </div>
                                  </div>

                                  {order.order_items && order.order_items.length > 0 && (
                                    <div className="space-y-2">
                                      {order.order_items.slice(0, 2).map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-sm text-gray-600">
                                          <span>
                                            {item.product_name} x {item.quantity}
                                          </span>
                                          <span>₹{(item.product_price * item.quantity).toLocaleString()}</span>
                                        </div>
                                      ))}
                                      {order.order_items.length > 2 && (
                                        <p className="text-sm text-gray-500">
                                          +{order.order_items.length - 2} more items
                                        </p>
                                      )}
                                    </div>
                                  )}
                                </div>

                                <div className="text-right">
                                  <p className="text-2xl font-bold text-emerald-600">
                                    ₹{order.total_amount.toLocaleString()}
                                  </p>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.push("/orders")}
                                    className="mt-2 border-emerald-200 hover:bg-emerald-50"
                                  >
                                    View Details
                                  </Button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                          {orders.length > 5 && (
                            <div className="text-center pt-4">
                              <Button
                                variant="outline"
                                onClick={() => router.push("/orders")}
                                className="border-emerald-200 hover:bg-emerald-50"
                              >
                                View All Orders ({orders.length})
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
