"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { getSupabaseClient } from "@/lib/supabase-client"
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  X,
  Camera,
  Package,
  RefreshCw,
  CheckCircle,
  Info,
} from "lucide-react"

interface Order {
  id: string
  created_at: string
  total_amount: number
  status: string
  order_items: Array<{
    product_name: string
    quantity: number
  }>
}

interface ReturnReason {
  value: string
  label: string
  refundPercentage: number
  description: string
  requiresPhotos: boolean
  timeLimit: number // hours
}

const returnReasons: ReturnReason[] = [
  {
    value: "damaged_shipping",
    label: "Damaged during shipping",
    refundPercentage: 100,
    description: "Product was damaged during delivery. Full refund or free replacement available.",
    requiresPhotos: true,
    timeLimit: 48,
  },
  {
    value: "defective_product",
    label: "Defective product",
    refundPercentage: 100,
    description: "Product has manufacturing defects. Full refund or free replacement available.",
    requiresPhotos: true,
    timeLimit: 48,
  },
  {
    value: "wrong_item",
    label: "Wrong item received",
    refundPercentage: 100,
    description: "Received different product than ordered. Full refund or free replacement available.",
    requiresPhotos: true,
    timeLimit: 48,
  },
  {
    value: "change_of_mind",
    label: "Change of mind",
    refundPercentage: 60,
    description: "Customer initiated return. 60% refund after inspection. Customer pays return shipping.",
    requiresPhotos: false,
    timeLimit: 48,
  },
  {
    value: "wrong_order",
    label: "Ordered wrong product",
    refundPercentage: 60,
    description: "Customer ordered wrong product. 60% refund after inspection. Customer pays return shipping.",
    requiresPhotos: false,
    timeLimit: 48,
  },
]

export default function ReturnsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [policyExpanded, setPolicyExpanded] = useState<number | null>(null)
  const [faqExpanded, setFaqExpanded] = useState<number | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [selectedReason, setSelectedReason] = useState<ReturnReason | null>(null)
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([])
  const [photoUrls, setPhotoUrls] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [returnRequest, setReturnRequest] = useState({
    orderId: "",
    reason: "",
    items: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    additionalNotes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderError, setOrderError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    if (user) {
      fetchUserOrders()
    }
  }, [user])

  useEffect(() => {
    if (selectedOrder) {
      setReturnRequest((prev) => ({
        ...prev,
        orderId: selectedOrder.id,
        items: selectedOrder.order_items.map((item) => `${item.product_name} (${item.quantity})`).join(", "),
      }))
    }
  }, [selectedOrder])

  useEffect(() => {
    const reason = returnReasons.find((r) => r.value === returnRequest.reason)
    setSelectedReason(reason || null)
  }, [returnRequest.reason])

  const fetchUserOrders = async () => {
    if (!user) return

    try {
      const supabase = getSupabaseClient()
      const { data: ordersData, error } = await supabase
        .from("orders")
        .select(`
          id,
          created_at,
          total_amount,
          status,
          order_items (
            product_name,
            quantity
          )
        `)
        .eq("user_id", user.id)
        .eq("payment_status", "completed")
        .in("status", ["confirmed", "delivered"])
        .order("created_at", { ascending: false })

      if (error) throw error

      // Filter orders within return window (2 days)
      const now = new Date()
      const validOrders =
        ordersData?.filter((order) => {
          const orderDate = new Date(order.created_at)
          const hoursDiff = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60)
          return hoursDiff <= 48 // 2 days
        }) || []

      setOrders(validOrders)
    } catch (error) {
      console.error("Error fetching orders:", error)
    }
  }

  const handlePhotoUpload = async (files: FileList) => {
    if (!files || files.length === 0) return

    setIsUploading(true)
    const newPhotos = Array.from(files)

    try {
      const supabase = getSupabaseClient()
      const uploadPromises = newPhotos.map(async (file) => {
        const fileName = `returns/${Date.now()}-${file.name}`
        const { data, error } = await supabase.storage.from("photos").upload(fileName, file)

        if (error) throw error

        const { data: urlData } = supabase.storage.from("photos").getPublicUrl(fileName)

        return urlData.publicUrl
      })

      const urls = await Promise.all(uploadPromises)
      setPhotoUrls((prev) => [...prev, ...urls])
      setUploadedPhotos((prev) => [...prev, ...newPhotos])
    } catch (error) {
      console.error("Error uploading photos:", error)
      setOrderError("Failed to upload photos. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const removePhoto = (index: number) => {
    setUploadedPhotos((prev) => prev.filter((_, i) => i !== index))
    setPhotoUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const handleReturnRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setOrderError("")

    if (!selectedOrder || !selectedReason) {
      setOrderError("Please select an order and return reason")
      setIsSubmitting(false)
      return
    }

    if (!returnRequest.customerName.trim()) {
      setOrderError("Please enter your full name")
      setIsSubmitting(false)
      return
    }

    if (!returnRequest.customerEmail.trim()) {
      setOrderError("Please enter your email address")
      setIsSubmitting(false)
      return
    }

    if (!returnRequest.customerPhone.trim()) {
      setOrderError("Please enter your phone number")
      setIsSubmitting(false)
      return
    }

    if (!returnRequest.customerAddress.trim()) {
      setOrderError("Please enter your return address")
      setIsSubmitting(false)
      return
    }

    if (selectedReason.requiresPhotos && photoUrls.length === 0) {
      setOrderError("Photos are required for this type of return")
      setIsSubmitting(false)
      return
    }

    try {
      const refundAmount = (selectedOrder.total_amount * selectedReason.refundPercentage) / 100

      const response = await fetch("/api/returns/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...returnRequest,
          photoUrls,
          refundPercentage: selectedReason.refundPercentage,
          refundAmount,
          returnReasonDetails: selectedReason,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setReturnRequest({
          orderId: "",
          reason: "",
          items: "",
          customerName: "",
          customerEmail: "",
          customerPhone: "",
          customerAddress: "",
          additionalNotes: "",
        })
        setPhotoUrls([])
        setUploadedPhotos([])
        setSelectedOrder(null)
        setSelectedReason(null)
        setSuccessMessage(
          `Your return request has been submitted successfully! Expected refund: ₹${refundAmount.toLocaleString()} (${selectedReason.refundPercentage}% of order value). You will receive confirmation emails shortly.`,
        )
        setTimeout(() => setSuccessMessage(""), 8000)
      } else {
        setOrderError(result.error || "Failed to submit return request. Please try again.")
      }
    } catch (error) {
      setOrderError("An error occurred while processing your return request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const canReturnOrder = (order: Order) => {
    const orderDate = new Date(order.created_at)
    const now = new Date()
    const hoursDiff = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60)
    return hoursDiff <= 48 // 2 days
  }

  const getTimeRemaining = (order: Order) => {
    const orderDate = new Date(order.created_at)
    const now = new Date()
    const hoursDiff = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60)
    const hoursRemaining = 48 - hoursDiff

    if (hoursRemaining <= 0) return "Return window expired"
    if (hoursRemaining < 1) return `${Math.floor(hoursRemaining * 60)} minutes remaining`
    return `${Math.floor(hoursRemaining)} hours remaining`
  }

  const policyData = [
    {
      title: "Return Window",
      content:
        "Returns must be initiated within 2 days (48 hours) of delivery. After this window, return requests will be automatically restricted.",
    },
    {
      title: "Return Conditions",
      content: `
        • Item must be unused, sealed, and in original packaging
        • For damaged/defective items: Report within 24 hours with photo proof
        • Photo evidence required for shipping damage claims
        • Customer bears return shipping cost for change-of-mind returns
      `,
    },
    {
      title: "Refund Policy",
      content: `
        Damaged/Defective Products (Shipping Damage):
        • 100% refund OR free replacement
        • Must upload photos within 48 hours
        
        Customer-Initiated Returns (Change of Mind):
        • 60% refund after inspection
        • Customer pays return shipping cost
        
        Refund Timeline: 5-7 business days after inspection
      `,
    },
    {
      title: "Non-Returnable Items",
      content: "• Used or opened products • Products reported damaged after 24 hours without photo proof",
    },
  ]

  const faqData = [
    {
      question: "How do I upload photos for my return request?",
      answer:
        "Click the upload area in the return form and select multiple photos. You can upload images of the outer packaging, damaged item, or any defects. Photos help us process your return faster.",
    },
    {
      question: "What's the difference between refund percentages?",
      answer:
        "Damaged/defective items get 100% refund or replacement. Change-of-mind returns get 60% refund after inspection, and you pay return shipping costs.",
    },
    {
      question: "Can I return an item after 2 days?",
      answer:
        "No, our return window is strictly 2 days from delivery. This ensures product freshness and quality for all customers.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button variant="ghost" onClick={() => router.back()} className="mr-4 hover:bg-emerald-100 rounded-xl">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Returns & Exchanges
              </h1>
              <p className="text-gray-600 mt-2">Easy returns within 2 days of delivery</p>
            </div>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Success Message */}
            <AnimatePresence>
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6"
                >
                  <Alert className="border-emerald-200 bg-emerald-50 rounded-xl">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <AlertDescription className="text-emerald-800">{successMessage}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Return Policy Sections */}
              <div className="lg:col-span-1">
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Return Policy</h2>
                  {policyData.map((section, index) => (
                    <Card
                      key={index}
                      className="bg-white/95 backdrop-blur-md shadow-lg border border-emerald-100 rounded-2xl"
                    >
                      <div
                        className="p-4 flex items-center justify-between cursor-pointer"
                        onClick={() => setPolicyExpanded((prev) => (prev === index ? null : index))}
                      >
                        <h3 className="text-lg font-semibold text-gray-800">{section.title}</h3>
                        <Button variant="ghost" size="icon">
                          {policyExpanded === index ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </Button>
                      </div>
                      <AnimatePresence>
                        {policyExpanded === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="px-4 pb-4"
                          >
                            <div className="text-gray-600 whitespace-pre-line">{section.content}</div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  ))}
                </motion.div>
              </div>

              {/* Return Request Form */}
              <div className="lg:col-span-2">
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                  <Card className="bg-white/95 backdrop-blur-md shadow-xl border border-emerald-100 rounded-3xl">
                    <CardContent className="p-8">
                      <h2 className="text-2xl font-bold text-gray-800 mb-6">Request a Return</h2>

                      <form onSubmit={handleReturnRequest} className="space-y-6">
                        {orderError && (
                          <Alert variant="destructive" className="rounded-xl">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{orderError}</AlertDescription>
                          </Alert>
                        )}

                        {/* Order Selection */}
                        <div>
                          <Label htmlFor="order-select" className="text-base font-semibold">
                            Select Order *
                          </Label>
                          <Select
                            onValueChange={(value) => {
                              const order = orders.find((o) => o.id === value)
                              setSelectedOrder(order || null)
                            }}
                          >
                            <SelectTrigger className="mt-2 bg-white/80 backdrop-blur-sm border-emerald-200 focus:border-emerald-400 rounded-xl">
                              <SelectValue placeholder="Choose an order to return" />
                            </SelectTrigger>
                            <SelectContent>
                              {orders.length === 0 ? (
                                <SelectItem value="no-orders" disabled>
                                  No eligible orders found
                                </SelectItem>
                              ) : (
                                orders.map((order) => (
                                  <SelectItem key={order.id} value={order.id}>
                                    <div className="flex flex-col">
                                      <span>
                                        Order #{order.id.slice(0, 8)} - ₹{order.total_amount.toLocaleString()}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {new Date(order.created_at).toLocaleDateString()} • {getTimeRemaining(order)}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          {orders.length === 0 && (
                            <p className="text-sm text-gray-500 mt-2">
                              No orders eligible for return. Orders must be returned within 2 days of delivery.
                            </p>
                          )}
                        </div>

                        {/* Return Reason */}
                        <div>
                          <Label htmlFor="return-reason" className="text-base font-semibold">
                            Return Reason *
                          </Label>
                          <Select onValueChange={(value) => setReturnRequest({ ...returnRequest, reason: value })}>
                            <SelectTrigger className="mt-2 bg-white/80 backdrop-blur-sm border-emerald-200 focus:border-emerald-400 rounded-xl">
                              <SelectValue placeholder="Select reason for return" />
                            </SelectTrigger>
                            <SelectContent>
                              {returnReasons.map((reason) => (
                                <SelectItem key={reason.value} value={reason.value}>
                                  <div className="flex flex-col">
                                    <span>{reason.label}</span>
                                    <span className="text-xs text-emerald-600">{reason.refundPercentage}% refund</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {selectedReason && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-3 p-4 bg-blue-50 rounded-xl border border-blue-200"
                            >
                              <div className="flex items-start gap-2">
                                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                                <div>
                                  <p className="text-sm text-blue-800 font-medium">
                                    {selectedReason.refundPercentage}% Refund Policy
                                  </p>
                                  <p className="text-sm text-blue-700 mt-1">{selectedReason.description}</p>
                                  {selectedOrder && (
                                    <p className="text-sm text-blue-600 mt-2 font-semibold">
                                      Expected refund: ₹
                                      {(
                                        (selectedOrder.total_amount * selectedReason.refundPercentage) /
                                        100
                                      ).toLocaleString()}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>

                        {/* Photo Upload */}
                        {selectedReason?.requiresPhotos && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                          >
                            <Label className="text-base font-semibold">
                              Upload Photos * (Required for this return type)
                            </Label>
                            <div className="border-2 border-dashed border-emerald-300 rounded-xl p-6 text-center bg-emerald-50/50">
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => e.target.files && handlePhotoUpload(e.target.files)}
                                className="hidden"
                                id="photo-upload"
                                disabled={isUploading}
                              />
                              <label htmlFor="photo-upload" className="cursor-pointer">
                                <div className="flex flex-col items-center gap-3">
                                  {isUploading ? (
                                    <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
                                  ) : (
                                    <Camera className="w-8 h-8 text-emerald-600" />
                                  )}
                                  <div>
                                    <p className="text-emerald-700 font-medium">
                                      {isUploading ? "Uploading photos..." : "Click to upload photos"}
                                    </p>
                                    <p className="text-sm text-emerald-600">
                                      Upload photos of packaging, damage, or defects
                                    </p>
                                  </div>
                                </div>
                              </label>
                            </div>

                            {/* Photo Preview */}
                            {uploadedPhotos.length > 0 && (
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {uploadedPhotos.map((photo, index) => (
                                  <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative group"
                                  >
                                    <img
                                      src={URL.createObjectURL(photo) || "/placeholder.svg"}
                                      alt={`Return photo ${index + 1}`}
                                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removePhoto(index)}
                                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </motion.div>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        )}

                        {/* Customer Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="customer-name">Full Name *</Label>
                            <Input
                              id="customer-name"
                              type="text"
                              value={returnRequest.customerName}
                              onChange={(e) => setReturnRequest({ ...returnRequest, customerName: e.target.value })}
                              className="mt-2 bg-white/80 backdrop-blur-sm border-emerald-200 focus:border-emerald-400 rounded-xl"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="customer-email">Email *</Label>
                            <Input
                              id="customer-email"
                              type="email"
                              value={returnRequest.customerEmail}
                              onChange={(e) => setReturnRequest({ ...returnRequest, customerEmail: e.target.value })}
                              className="mt-2 bg-white/80 backdrop-blur-sm border-emerald-200 focus:border-emerald-400 rounded-xl"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="customer-phone">Phone Number *</Label>
                            <Input
                              id="customer-phone"
                              type="tel"
                              value={returnRequest.customerPhone}
                              onChange={(e) => setReturnRequest({ ...returnRequest, customerPhone: e.target.value })}
                              className="mt-2 bg-white/80 backdrop-blur-sm border-emerald-200 focus:border-emerald-400 rounded-xl"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="customer-address">Return Address *</Label>
                            <Input
                              id="customer-address"
                              type="text"
                              value={returnRequest.customerAddress}
                              onChange={(e) => setReturnRequest({ ...returnRequest, customerAddress: e.target.value })}
                              className="mt-2 bg-white/80 backdrop-blur-sm border-emerald-200 focus:border-emerald-400 rounded-xl"
                              required
                            />
                          </div>
                        </div>

                        {/* Additional Notes */}
                        <div>
                          <Label htmlFor="additional-notes">Additional Notes (Optional)</Label>
                          <Textarea
                            id="additional-notes"
                            value={returnRequest.additionalNotes}
                            onChange={(e) => setReturnRequest({ ...returnRequest, additionalNotes: e.target.value })}
                            className="mt-2 bg-white/80 backdrop-blur-sm border-emerald-200 focus:border-emerald-400 rounded-xl"
                            rows={3}
                            placeholder="Any additional information about your return..."
                          />
                        </div>

                        <Button
                          type="submit"
                          disabled={isSubmitting || !selectedOrder || !selectedReason}
                          className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl py-3 text-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center justify-center">
                              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                              Submitting Return Request...
                            </div>
                          ) : (
                            <div className="flex items-center justify-center">
                              <Package className="w-5 h-5 mr-2" />
                              Submit Return Request
                            </div>
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* FAQ Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-8"
                >
                  <Card className="bg-white/95 backdrop-blur-md shadow-lg border border-emerald-100 rounded-2xl">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h3>
                      <div className="space-y-3">
                        {faqData.map((faq, index) => (
                          <div key={index} className="border-b border-emerald-100 pb-3 last:border-b-0">
                            <div
                              className="flex items-center justify-between cursor-pointer"
                              onClick={() => setFaqExpanded((prev) => (prev === index ? null : index))}
                            >
                              <h4 className="text-base font-medium text-gray-700">{faq.question}</h4>
                              <Button variant="ghost" size="icon">
                                {faqExpanded === index ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                            <AnimatePresence>
                              {faqExpanded === index && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="mt-2 text-gray-600"
                                >
                                  {faq.answer}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
