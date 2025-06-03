"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ShoppingCart,
  Plus,
  Minus,
  Leaf,
  Shield,
  Hand,
  Sun,
  Search,
  X,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Star,
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { PaymentService } from "@/components/payment-service"
import { ScrollAnimation } from "@/components/scroll-animation"
import { PageTransition } from "@/components/page-transition"
import { FloatingElements } from "@/components/floating-elements"
import { InteractiveCard } from "@/components/interactive-card"
import { MorphingBackground } from "@/components/morphing-background"
import { LoadingAnimation } from "@/components/loading-animation"
import HeroSection from "@/components/hero-section"
import { useCart } from "@/components/cart-context"
import { useToast } from "@/components/toast-provider"

// Enhanced products array with more details
const products = [
  {
    id: 1,
    name: "Premium Argan Shampoo",
    price: 300,
    originalPrice: 599,
    image:
      "https://images.unsplash.com/photo-1748104313760-d051ffd69541?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8OXx8fGVufDB8fHx8fA%3D%3D",
    description: "Premium argan oil serum for deep nourishment and shine",
    benefits: ["Reduces frizz", "Adds shine", "Nourishes scalp"],
    ingredients: ["Argan Oil", "Vitamin E", "Jojoba Oil"],
    inStock: true,
    featured: false,
    category: "Hair Care",
    productType: "shampoo",
    rating: 4.8,
    reviews: 124,
  },
  {
    id: 2,
    name: "Herbal Green Mask",
    price: 300,
    originalPrice: 699,
    image:
      "https://images.unsplash.com/photo-1748104313770-356af1cda480?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8M3x8fGVufDB8fHx8fA%3D%3D",
    description: "Intensive keratin treatment mask for damaged hair",
    benefits: ["Repairs damage", "Strengthens hair", "Reduces breakage"],
    ingredients: ["Keratin", "Biotin", "Coconut Oil"],
    inStock: true,
    featured: false,
    category: "Mask",
    productType: "mask",
    rating: 4.6,
    reviews: 89,
  },
  {
    id: 3,
    name: "Nourishing Hair Oil",
    price: 300,
    originalPrice: 399,
    image:
      "https://images.unsplash.com/photo-1748104313828-159cbf71e6fe?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8NHx8fGVufDB8fHx8fA%3D%3D",
    description: "Deep cleansing scalp treatment with natural extracts",
    benefits: ["Cleanses scalp", "Removes buildup", "Promotes growth"],
    ingredients: ["Tea Tree Oil", "Peppermint", "Charcoal"],
    inStock: true,
    featured: false,
    category: "Oil",
    productType: "oil",
    rating: 4.9,
    reviews: 156,
  },
  {
    id: 4,
    name: "Therapeutic Scalp Mask",
    price: 300,
    originalPrice: 649,
    image:
      "https://images.unsplash.com/photo-1748104313769-f4d38e95b9df?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8NXx8fGVufDB8fHx8fA%3D%3D",
    description: "Lightweight mousse for natural volume and hold",
    benefits: ["Adds volume", "Long-lasting hold", "No residue"],
    ingredients: ["Rice Protein", "Aloe Vera", "Panthenol"],
    inStock: true,
    featured: false,
    category: "Mask",
    productType: "mask",
    rating: 4.7,
    reviews: 73,
  },
  {
    id: 5,
    name: "Pure Aloe Vera Gel",
    price: 250,
    originalPrice: 599,
    image:
      "https://images.unsplash.com/photo-1748104313858-e350edbef125?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8Mnx8fGVufDB8fHx8fA%3D%3D",
    description: "Ayurvedic hair growth oil with 12 natural herbs",
    benefits: ["Stimulates growth", "Reduces hair fall", "Strengthens roots"],
    ingredients: ["Bhringraj", "Amla", "Fenugreek"],
    inStock: true,
    featured: false,
    category: "Gel",
    productType: "gel",
    rating: 4.5,
    reviews: 92,
  },
  {
    id: 6,
    name: "Smoothing Hair Mask",
    price: 250,
    originalPrice: 449,
    image:
      "https://images.unsplash.com/photo-1748104313816-29b1f3873451?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8N3x8fGVufDB8fHx8fA%3D%3D",
    description: "Intensive weekly treatment for dry and damaged hair",
    benefits: ["Deep hydration", "Repairs damage", "Softens hair"],
    ingredients: ["Shea Butter", "Argan Oil", "Protein Complex"],
    inStock: true,
    featured: false,
    category: "Mask",
    productType: "mask",
    rating: 4.8,
    reviews: 108,
  },
  {
    id: 7,
    name: "Natural Hair Dye",
    price: 540,
    originalPrice: 749,
    image:
      "https://images.unsplash.com/photo-1748104313975-53931e0743b2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8Nnx8fGVufDB8fHx8fA%3D%3D",
    description: "Natural hair dye comes with 3 different packs for 3 different process.",
    benefits: ["Chemical-free coloring", "Long-lasting", "Hair-friendly"],
    ingredients: ["Henna", "Indigo", "Amla"],
    inStock: true,
    featured: false,
    category: "Dye",
    productType: "shampoo",
    rating: 4.4,
    reviews: 67,
  },
  {
    id: 8,
    name: "Healing Aloe Gel",
    price: 250,
    originalPrice: 549,
    image:
      "https://images.unsplash.com/photo-1748104313831-12100b94aba2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8OHx8fGVufDB8fHx8fA%3D%3D",
    description: "Pure aloe vera gel for hair and scalp nourishment",
    benefits: ["Soothes scalp", "Moisturizes", "Reduces inflammation"],
    ingredients: ["Pure Aloe Vera", "Vitamin E", "Natural Preservatives"],
    inStock: true,
    featured: false,
    category: "Gel",
    productType: "gel",
    rating: 4.6,
    reviews: 134,
  },
  {
    id: 9,
    name: "Professional Keratin Mask",
    price: 250,
    originalPrice: 649,
    image:
      "https://images.unsplash.com/photo-1748104313866-aff6443accb0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8MXx8fGVufDB8fHx8fA%3D%3D",
    description: "Professional keratin treatment mask for salon-quality results",
    benefits: ["Smooths frizz", "Strengthens hair", "Adds shine"],
    ingredients: ["Hydrolyzed Keratin", "Argan Oil", "Silk Proteins"],
    inStock: true,
    featured: false,
    category: "Mask",
    productType: "mask",
    rating: 4.9,
    reviews: 187,
  },
]

interface CheckoutForm {
  name: string
  email: string
  phone: string
  address: string
}

// Helper function to generate short receipt ID (max 40 chars)
const generateReceiptId = () => {
  const timestamp = Date.now().toString()
  const random = Math.random().toString(36).substring(2, 8)
  return `SP_${timestamp}_${random}`.substring(0, 40)
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [checkoutForm, setCheckoutForm] = useState<CheckoutForm>({
    name: "",
    email: "",
    phone: "",
    address: "",
  })
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [paymentError, setPaymentError] = useState("")
  const [orderSuccess, setOrderSuccess] = useState(false)

  const { user, signOut } = useAuth()
  const { cart, isCartOpen, setIsCartOpen, addToCart, updateQuantity, getTotalPrice, getTotalItems, clearCart } =
    useCart()
  const { addToast } = useToast()

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Checkout functions
  const handleCheckout = () => {
    if (cart.length === 0) {
      addToast({
        type: "warning",
        title: "Cart is Empty",
        description: "Please add some products to your cart before checkout",
      })
      return
    }
    if (!user) {
      addToast({
        type: "info",
        title: "Login Required",
        description: "Please log in to continue with checkout",
        action: {
          label: "Go to Login",
          onClick: () => (window.location.href = "/login"),
        },
      })
      return
    }
    setIsCheckoutOpen(true)
    setIsCartOpen(false)
  }

  const processPayment = async () => {
    if (
      !checkoutForm.name?.trim() ||
      !checkoutForm.email?.trim() ||
      !checkoutForm.phone?.trim() ||
      !checkoutForm.address?.trim()
    ) {
      setPaymentError("Please fill in all required fields")
      return
    }

    if (!user?.id) {
      setPaymentError("Please log in to continue")
      return
    }

    if (cart.length === 0) {
      setPaymentError("Your cart is empty")
      return
    }

    setIsProcessingPayment(true)
    setPaymentError("")

    try {
      console.log("🚀 Starting payment process...")

      // Generate short receipt ID
      const receiptId = generateReceiptId()
      console.log("📝 Generated receipt ID:", receiptId, "Length:", receiptId.length)

      const orderPayload = {
        amount: getTotalPrice(),
        currency: "INR",
        receipt: receiptId,
        userId: user.id,
        orderData: {
          customerName: checkoutForm.name.trim(),
          customerEmail: checkoutForm.email.trim(),
          customerPhone: checkoutForm.phone.trim(),
          shippingAddress: checkoutForm.address.trim(),
          items: cart.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      }

      // Create Razorpay order
      const orderResponse = await fetch("/api/create-razorpay-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(orderPayload),
      })

      if (!orderResponse.ok) {
        const errorText = await orderResponse.text()
        console.error("❌ Order creation failed:", errorText)

        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch {
          errorData = { error: `Server error (${orderResponse.status})`, details: errorText }
        }

        throw new Error(errorData.details || errorData.error || `Server error (${orderResponse.status})`)
      }

      const orderData = await orderResponse.json()

      if (!orderData.success) {
        throw new Error(orderData.details || orderData.error || "Failed to create order")
      }

      if (!orderData.razorpayOrder || !orderData.razorpayOrder.id) {
        console.error("❌ Invalid order response:", orderData)
        throw new Error("Invalid order response from server")
      }

      // Initiate Razorpay payment
      await PaymentService.initiatePayment({
        amount: getTotalPrice(),
        currency: "INR",
        orderId: orderData.razorpayOrder.id,
        customerName: checkoutForm.name.trim(),
        customerEmail: checkoutForm.email.trim(),
        customerPhone: checkoutForm.phone.trim(),
        onSuccess: async (response: any) => {
          try {
            // Verify payment
            const verifyResponse = await fetch("/api/verify-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                order_id: orderData.orderId,
              }),
            })

            if (!verifyResponse.ok) {
              const errorText = await verifyResponse.text()
              console.error("❌ Verification failed:", errorText)
              throw new Error(`Verification failed (${verifyResponse.status})`)
            }

            const verifyData = await verifyResponse.json()

            if (verifyData.success) {
              setOrderSuccess(true)
              clearCart()
              setIsCheckoutOpen(false)
              setCheckoutForm({ name: "", email: "", phone: "", address: "" })

              addToast({
                type: "success",
                title: "Payment Successful!",
                description: "Your order has been confirmed. Check your email for details.",
                duration: 6000,
              })
            } else {
              throw new Error(verifyData.error || "Payment verification failed")
            }
          } catch (error: any) {
            console.error("❌ Payment verification error:", error)
            setPaymentError(error.message || "Payment verification failed")
          } finally {
            setIsProcessingPayment(false)
          }
        },
        onError: (error: any) => {
          console.error("❌ Payment error:", error)
          setPaymentError(error.description || error.error || "Payment failed")
          setIsProcessingPayment(false)
        },
      })
    } catch (error: any) {
      console.error("❌ Payment process error:", error)
      setPaymentError(error.message || "Failed to process payment")
      setIsProcessingPayment(false)
    }
  }

  return (
    <PageTransition>
      <div className="min-h-screen relative">
        {/* Background Effects */}
        <MorphingBackground />
        <FloatingElements />

        {/* Header */}
        <header className="sticky top-0 z-50 bg-gradient-to-r from-emerald-800/95 via-emerald-900/95 to-green-900/95 text-white backdrop-blur-md shadow-2xl border-b border-emerald-200/20">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <motion.div
                className="flex items-center space-x-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-25%20153324.jpg-S8ULBXQxRku2nldAM9Q4PiLEhjr55f.png"
                  alt="SPARSH Logo"
                  className="h-14 w-auto max-w-[160px] object-contain"
                />
              </motion.div>

              <div className="flex items-center space-x-4">
                {/* Cart */}
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCartOpen(true)}
                    className="relative text-white hover:bg-emerald-700/50 transition-all duration-300 backdrop-blur-sm"
                  >
                    <motion.div
                      animate={getTotalItems() > 0 ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </motion.div>
                    <AnimatePresence>
                      {getTotalItems() > 0 && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute -top-2 -right-2"
                        >
                          <Badge className="bg-emerald-600 text-white text-xs animate-pulse shadow-lg min-w-[20px] h-5 flex items-center justify-center">
                            {getTotalItems()}
                          </Badge>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>

                {/* User Menu */}
                {user ? (
                  <div className="flex items-center space-x-2">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hidden md:block text-sm text-white/90"
                    >
                      Hello, {user.user_metadata?.full_name || user.email?.split("@")[0] || "User"}
                    </motion.span>
                    <Button
                      variant="ghost"
                      onClick={() => (window.location.href = "/profile")}
                      className="text-white hover:bg-emerald-700/50 transition-all duration-300"
                    >
                      Profile
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={signOut}
                      className="text-white hover:bg-emerald-700/50 transition-all duration-300"
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="hidden md:flex space-x-2">
                    <Button
                      variant="ghost"
                      onClick={() => (window.location.href = "/login")}
                      className="text-white hover:bg-emerald-700/50 transition-all duration-300"
                    >
                      Login
                    </Button>
                    <Button
                      onClick={() => (window.location.href = "/signup")}
                      className="text-white hover:bg-emerald-700/50 transition-all duration-300"
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <HeroSection />

        {/* Features Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <ScrollAnimation direction="up" className="text-center mb-16">
              <motion.h2
                className="text-4xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  Why Choose SPARSH?
                </span>
              </motion.h2>
              <motion.p
                className="text-xl text-gray-600 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Experience the difference of premium natural hair care with our scientifically-backed, nature-inspired
                formulations
              </motion.p>
            </ScrollAnimation>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Leaf,
                  title: "100% Natural",
                  description: "Organic ingredients sourced from nature's finest",
                  color: "emerald",
                  gradient: "from-emerald-400 to-green-500",
                },
                {
                  icon: Shield,
                  title: "Herbal Products",
                  description: "Safe and gentle for all hair types",
                  color: "blue",
                  gradient: "from-blue-400 to-cyan-500",
                },
                {
                  icon: Hand,
                  title: "Handcrafted Excellence",
                  description: "Small-batch production for premium quality",
                  color: "purple",
                  gradient: "from-purple-400 to-pink-500",
                },
                {
                  icon: Sun,
                  title: "Radiant Results",
                  description: "Visible transformation in just weeks",
                  color: "yellow",
                  gradient: "from-yellow-400 to-orange-500",
                },
              ].map((feature, index) => (
                <ScrollAnimation
                  key={index}
                  direction={index % 2 === 0 ? "up" : "down"}
                  threshold={0.1}
                  duration={0.6}
                  delay={index * 0.1}
                  className="h-full"
                >
                  <InteractiveCard className="h-full" glowColor={feature.color} intensity={0.2}>
                    <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 text-center h-full border border-white/20 shadow-xl">
                      <motion.div
                        className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}
                        whileHover={{
                          scale: 1.2,
                          rotate: [0, -15, 15, 0],
                          transition: { duration: 0.6 },
                        }}
                        animate={{
                          y: [0, -5, 0],
                        }}
                        transition={{
                          duration: 3 + index,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                          delay: index * 0.5,
                        }}
                      >
                        <feature.icon className="w-8 h-8 text-white" />
                      </motion.div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </InteractiveCard>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="py-20 relative">
          <div className="container mx-auto px-4">
            <ScrollAnimation direction="up" className="text-center mb-16">
              <motion.h2
                className="text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                  Our Premium Collection
                </span>
              </motion.h2>
              <motion.p
                className="text-xl text-gray-600 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Discover our scientifically-formulated range of premium natural hair care products, each designed to
                address specific hair concerns with visible results
              </motion.p>
            </ScrollAnimation>

            {/* Search and Filter */}
            <motion.div
              className="flex flex-col md:flex-row gap-6 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search for your perfect hair solution..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-4 border-emerald-200 focus:border-emerald-400 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg text-lg"
                />
              </div>
              <div className="flex gap-3 flex-wrap">
                {["All", "Hair Care", "Oil", "Gel", "Mask", "Dye"].map((category) => (
                  <motion.div key={category} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant={selectedCategory === category ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category)}
                      className={
                        selectedCategory === category
                          ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-2xl px-6 py-3 shadow-lg"
                          : "border-emerald-200 hover:bg-emerald-50 rounded-2xl px-6 py-3 bg-white/80 backdrop-blur-sm"
                      }
                    >
                      {category}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.9 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    className="group"
                    whileHover={{ y: -10 }}
                  >
                    <InteractiveCard className="h-full" glowColor="emerald" intensity={0.15}>
                      <div className="bg-white/90 backdrop-blur-md rounded-3xl overflow-hidden shadow-xl border border-white/20 h-full">
                        <div className="relative overflow-hidden">
                          <motion.img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-72 object-contain"
                            whileHover={{ scale: 0.85 }}
                            transition={{ duration: 0.6 }}
                          />

                          {/* Overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          <AnimatePresence>
                            {product.featured && (
                              <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                className="absolute top-4 left-4"
                              >
                                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg px-3 py-1">
                                  <Star className="w-3 h-3 mr-1" />
                                  Featured
                                </Badge>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <div className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <Badge
                              variant="secondary"
                              className="bg-emerald-100 text-emerald-700 rounded-full px-3 py-1"
                            >
                              {product.category}
                            </Badge>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium text-gray-700">{product.rating}</span>
                              <span className="text-xs text-gray-500">({product.reviews})</span>
                            </div>
                          </div>

                          <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-emerald-600 transition-colors">
                            {product.name}
                          </h3>

                          <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">{product.description}</p>

                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl font-bold text-emerald-600">
                                ₹{product.price.toLocaleString()}
                              </span>
                              <span className="text-lg text-gray-400 line-through">
                                ₹{product.originalPrice.toLocaleString()}
                              </span>
                              <Badge className="bg-red-100 text-red-600 text-xs px-2 py-1">
                                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                                OFF
                              </Badge>
                            </div>
                          </div>

                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              onClick={() => addToCart(product)}
                              disabled={!product.inStock}
                              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-2xl py-3 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                              animate={
                                !product.inStock
                                  ? {}
                                  : {
                                      boxShadow: [
                                        "0 4px 14px 0 rgba(16, 185, 129, 0.2)",
                                        "0 4px 14px 0 rgba(16, 185, 129, 0.4)",
                                        "0 4px 14px 0 rgba(16, 185, 129, 0.2)",
                                      ],
                                    }
                              }
                              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                            >
                              {product.inStock ? (
                                <>
                                  <ShoppingCart className="w-5 h-5 mr-2" />
                                  Add to Cart
                                </>
                              ) : (
                                "Out of Stock"
                              )}
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </InteractiveCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 text-white py-20 relative overflow-hidden">
          {/* Footer background effects */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-500 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-25%20153324.jpg-S8ULBXQxRku2nldAM9Q4PiLEhjr55f.png"
                  alt="SPARSH Logo"
                  className="h-16 w-auto max-w-[180px] object-contain mb-6"
                />
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Transform your hair naturally with our premium organic hair care products, crafted with love and
                  backed by science.
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h3 className="text-xl font-bold mb-6 text-emerald-400">Quick Links</h3>
                <ul className="space-y-3">
                  {["Products", "Hair Solutions", "Contact", "Returns"].map((link, index) => (
                    <motion.li key={link} whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                      <a
                        href={`/${link.toLowerCase().replace(" ", "-")}`}
                        className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 flex items-center"
                      >
                        <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {link}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <h3 className="text-xl font-bold mb-6 text-emerald-400">Customer Care</h3>
                <ul className="space-y-3">
                  {["Contact Us", "Returns & Exchanges", "Privacy Policy", "Terms & Conditions"].map((link) => (
                    <motion.li key={link} whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                      <a
                        href={`/${link.toLowerCase().replace(/\s+/g, "-").replace("&", "")}`}
                        className="text-gray-300 hover:text-emerald-400 transition-colors duration-300"
                      >
                        {link}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <h3 className="text-xl font-bold mb-6 text-emerald-400">Get in Touch</h3>
                <div className="space-y-4 text-gray-300">
                  <motion.div className="flex items-center" whileHover={{ scale: 1.05 }}>
                    <span className="text-2xl mr-3">📞</span>
                    <span>+91 9409073136</span>
                  </motion.div>
                  <motion.div className="flex items-center" whileHover={{ scale: 1.05 }}>
                    <span className="text-2xl mr-3">📧</span>
                    <span>rs.sparshnaturals@gmail.com</span>
                  </motion.div>
                  <motion.div className="flex items-center" whileHover={{ scale: 1.05 }}>
                    <span className="text-2xl mr-3">📍</span>
                    <span>Bhavnagar, Gujarat</span>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            <motion.div
              className="border-t border-gray-700 mt-12 pt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-gray-400 text-lg">
                &copy; 2025 SPARSH Natural Hair Care. All rights reserved. <br />
                <span className="text-emerald-400">Built with ❤️ for your Natural Hair Journey 🌿</span>
              </p>
            </motion.div>
          </div>
        </footer>

        {/* Enhanced Cart Sidebar */}
        <AnimatePresence>
          {isCartOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                onClick={() => setIsCartOpen(false)}
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 h-full w-full max-w-md bg-white/95 backdrop-blur-md z-50 shadow-2xl"
              >
                <div className="p-6 border-b bg-gradient-to-r from-emerald-50 to-green-50">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-emerald-800">Shopping Cart</h2>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)}>
                        <X className="w-6 h-6" />
                      </Button>
                    </motion.div>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 max-h-[calc(100vh-200px)]">
                  {cart.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-12"
                    >
                      <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">Your cart is empty</p>
                      <p className="text-gray-400 text-sm mt-2">Add some products to get started!</p>
                    </motion.div>
                  ) : (
                    <div className="space-y-4">
                      <AnimatePresence>
                        {cart.map((item, index) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center space-x-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-100 shadow-sm"
                          >
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-xl"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-800">{item.name}</h3>
                              <p className="text-emerald-600 font-bold">₹{item.price.toLocaleString()}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-8 h-8 border-emerald-200 hover:bg-emerald-50 rounded-lg"
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                              </motion.div>
                              <span className="w-8 text-center font-semibold">{item.quantity}</span>
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-8 h-8 border-emerald-200 hover:bg-emerald-50 rounded-lg"
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </motion.div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
                {cart.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 border-t bg-gradient-to-r from-emerald-50 to-green-50"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-bold text-gray-800">Total:</span>
                      <span className="text-2xl font-bold text-emerald-600">₹{getTotalPrice().toLocaleString()}</span>
                    </div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={handleCheckout}
                        className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <CreditCard className="w-5 h-5 mr-2" />
                        Proceed to Checkout
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Enhanced Checkout Modal - Centered and Positioned Higher */}
        <AnimatePresence>
          {isCheckoutOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                onClick={() => setIsCheckoutOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 50 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto"
              >
                <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-md border border-white/20 my-8">
                  <div className="p-6 border-b bg-gradient-to-r from-emerald-50 to-green-50 rounded-t-3xl">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-emerald-800">Secure Checkout</h2>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button variant="ghost" size="icon" onClick={() => setIsCheckoutOpen(false)}>
                          <X className="w-6 h-6" />
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                  <div className="p-6">
                    <AnimatePresence>
                      {paymentError && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <Alert variant="destructive" className="mb-4 rounded-xl">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{paymentError}</AlertDescription>
                          </Alert>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="space-y-4">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                        <Input
                          type="text"
                          value={checkoutForm.name}
                          onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                          className="border-emerald-200 focus:border-emerald-400 rounded-xl py-3"
                          required
                          placeholder="Enter your full name"
                        />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                        <Input
                          type="email"
                          value={checkoutForm.email}
                          onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                          className="border-emerald-200 focus:border-emerald-400 rounded-xl py-3"
                          required
                          placeholder="Enter your email address"
                        />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                        <Input
                          type="tel"
                          value={checkoutForm.phone}
                          onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                          className="border-emerald-200 focus:border-emerald-400 rounded-xl py-3"
                          required
                          placeholder="Enter your phone number"
                        />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Address *</label>
                        <textarea
                          value={checkoutForm.address}
                          onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                          className="w-full p-3 border border-emerald-200 rounded-xl focus:border-emerald-400 focus:outline-none"
                          rows={3}
                          required
                          placeholder="Enter your complete shipping address"
                        />
                      </motion.div>
                    </div>
                    <motion.div
                      className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-100"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <h3 className="font-semibold mb-2 text-emerald-800">Order Summary</h3>
                      {cart.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm mb-1">
                          <span>
                            {item.name} x {item.quantity}
                          </span>
                          <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="border-t border-emerald-200 pt-2 mt-2">
                        <div className="flex justify-between font-bold">
                          <span>Total:</span>
                          <span className="text-emerald-600">₹{getTotalPrice().toLocaleString()}</span>
                        </div>
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={processPayment}
                        disabled={isProcessingPayment}
                        className="w-full mt-6 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        {isProcessingPayment ? (
                          <div className="flex items-center justify-center">
                            <LoadingAnimation size="sm" color="white" />
                            <span className="ml-2">Processing Payment...</span>
                          </div>
                        ) : (
                          <>
                            <CreditCard className="w-5 h-5 mr-2" />
                            Pay Securely with Razorpay
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Enhanced Success Modal */}
        <AnimatePresence>
          {orderSuccess && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-md p-8 text-center border border-white/20">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", damping: 15 }}
                    className="w-20 h-20 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                  >
                    <CheckCircle className="w-12 h-12 text-white" />
                  </motion.div>
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl font-bold text-gray-800 mb-4"
                  >
                    Order Successful! 🎉
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-600 mb-6 leading-relaxed"
                  >
                    Thank you for choosing SPARSH! Your order has been confirmed and you will receive an email
                    confirmation with your invoice and tracking details shortly.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-3"
                  >
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={() => {
                          setOrderSuccess(false)
                          window.location.href = "/orders"
                        }}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl py-3"
                      >
                        View My Orders
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setOrderSuccess(false)
                          document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })
                        }}
                        className="w-full border-emerald-200 hover:bg-emerald-50 rounded-2xl py-3"
                      >
                        Continue Shopping
                      </Button>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}
