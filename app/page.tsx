"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
  Search,
  Menu,
  X,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Star,
  Heart,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Award,
  Sparkles,
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { PaymentService } from "@/components/payment-service"

// Replace the products array with proper image URLs
const products = [
  {
    id: 1,
    name: "Shampoo",
    price: 309,
    originalPrice: 599,
    image:
      "https://images.unsplash.com/photo-1748104313760-d051ffd69541?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8OXx8fGVufDB8fHx8fA%3D%3D",
    description: "Premium argan oil serum for deep nourishment and shine",
    benefits: ["Reduces frizz", "Adds shine", "Nourishes scalp"],
    ingredients: ["Argan Oil", "Vitamin E", "Jojoba Oil"],
    inStock: true,
    featured: false,
    category: "Hair Care",
    rating: 4.8,
    reviews: 124,
  },
  {
    id: 2,
    name: "Green Mask",
    price: 309,
    originalPrice: 699,
    image:
      "https://images.unsplash.com/photo-1748104313770-356af1cda480?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8M3x8fGVufDB8fHx8fA%3D%3D",
    description: "Intensive keratin treatment shampoo for damaged hair",
    benefits: ["Repairs damage", "Strengthens hair", "Reduces breakage"],
    ingredients: ["Keratin", "Biotin", "Coconut Oil"],
    inStock: true,
    featured: false,
    category: "Mask",
    rating: 4.6,
    reviews: 89,
  },
  {
    id: 3,
    name: "Hair Oil",
    price: 309,
    originalPrice: 399,
    image:
      "https://images.unsplash.com/photo-1748104313828-159cbf71e6fe?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8NHx8fGVufDB8fHx8fA%3D%3D",
    description: "Deep cleansing scalp treatment with natural extracts",
    benefits: ["Cleanses scalp", "Removes buildup", "Promotes growth"],
    ingredients: ["Tea Tree Oil", "Peppermint", "Charcoal"],
    inStock: true,
    featured: false,
    category: "Oil",
    rating: 4.9,
    reviews: 156,
  },
  {
    id: 4,
    name: "Hair Psoriasis Mask",
    price: 309,
    originalPrice: 649,
    image:
      "https://images.unsplash.com/photo-1748104313769-f4d38e95b9df?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8NXx8fGVufDB8fHx8fA%3D%3D",
    description: "Lightweight mousse for natural volume and hold",
    benefits: ["Adds volume", "Long-lasting hold", "No residue"],
    ingredients: ["Rice Protein", "Aloe Vera", "Panthenol"],
    inStock: true,
    featured: false,
    category: "Mask",
    rating: 4.7,
    reviews: 73,
  },
  {
    id: 5,
    name: "Back Aloe Vera Gel",
    price: 269,
    originalPrice: 599,
    image:
      "https://images.unsplash.com/photo-1748104313858-e350edbef125?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8Mnx8fGVufDB8fHx8fA%3D%3D",
    description: "Ayurvedic hair growth oil with 12 natural herbs",
    benefits: ["Stimulates growth", "Reduces hair fall", "Strengthens roots"],
    ingredients: ["Bhringraj", "Amla", "Fenugreek"],
    inStock: true,
    featured: false,
    category: "Gel",
    rating: 4.5,
    reviews: 92,
  },
  {
    id: 6,
    name: "Hair Smoothing Mask",
    price: 269,
    originalPrice: 449,
    image:
      "https://images.unsplash.com/photo-1748104313816-29b1f3873451?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8N3x8fGVufDB8fHx8fA%3D%3D",
    description: "Intensive weekly treatment for dry and damaged hair",
    benefits: ["Deep hydration", "Repairs damage", "Softens hair"],
    ingredients: ["Shea Butter", "Argan Oil", "Protein Complex"],
    inStock: true,
    featured: false,
    category: "Mask",
    rating: 4.8,
    reviews: 67,
  },
  {
    id: 7,
    name: "Natural Hair Dye",
    price: 569,
    originalPrice: 749,
    image:
      "https://images.unsplash.com/photo-1748104313975-53931e0743b2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8Nnx8fGVufDB8fHx8fA%3D%3D",
    description: "Natural hair dye comes with 3 different packs for 3 different process.",
    benefits: ["Chemical-free coloring", "Long-lasting", "Hair-friendly"],
    ingredients: ["Henna", "Indigo", "Amla"],
    inStock: true,
    featured: false,
    category: "Dye",
    rating: 4.6,
    reviews: 45,
  },
  {
    id: 8,
    name: "Aloe Vera Gel",
    price: 269,
    originalPrice: 549,
    image:
      "https://images.unsplash.com/photo-1748104313831-12100b94aba2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8OHx8fGVufDB8fHx8fA%3D%3D",
    description: "Pure aloe vera gel for hair and scalp nourishment",
    benefits: ["Soothes scalp", "Moisturizes", "Reduces inflammation"],
    ingredients: ["Pure Aloe Vera", "Vitamin E", "Natural Preservatives"],
    inStock: true,
    featured: false,
    category: "Gel",
    rating: 4.7,
    reviews: 83,
  },
  {
    id: 9,
    name: "Keratin Mask",
    price: 269,
    originalPrice: 649,
    image:
      "https://images.unsplash.com/photo-1748104313866-aff6443accb0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8MXx8fGVufDB8fHx8fA%3D%3D",
    description: "Professional keratin treatment mask for salon-quality results",
    benefits: ["Smooths frizz", "Strengthens hair", "Adds shine"],
    ingredients: ["Hydrolyzed Keratin", "Argan Oil", "Silk Proteins"],
    inStock: true,
    featured: false,
    category: "Mask",
    rating: 4.9,
    reviews: 112,
  },
]

/*const testimonials = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    text: "The hair oil transformed my damaged hair completely. Highly recommended!",
    product: "Hair Oil",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    name: "Anita Desai",
    location: "Bangalore",
    rating: 5,
    text: "Best natural products I've ever used. My hair feels so much healthier!",
    product: "Shampoo",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    name: "Kavya Patel",
    location: "Ahmedabad",
    rating: 5,
    text: "Amazing results with the keratin mask. My hair is so smooth now!",
    product: "Keratin Mask",
    image: "/placeholder.svg?height=60&width=60",
  },
]*/

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

interface CheckoutForm {
  name: string
  email: string
  phone: string
  address: string
}

interface Notification {
  id: string
  type: "success" | "error" | "info"
  title: string
  message: string
}

// Helper function to generate short receipt ID (max 40 chars)
const generateReceiptId = () => {
  const timestamp = Date.now().toString()
  const random = Math.random().toString(36).substring(2, 8)
  return `SP_${timestamp}_${random}`.substring(0, 40)
}

export default function HomePage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
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
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const { user, signOut } = useAuth()

  // Add notification function
  const addNotification = (notification: Omit<Notification, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setNotifications((prev) => [...prev, { ...notification, id }])
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, 5000)
  }

  // Remove notification function
  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Get featured products
  const featuredProducts = products.filter((product) => product.featured)

  // Cart functions
  const addToCart = (product: any) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)
      if (existingItem) {
        const updatedCart = prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
        addNotification({
          type: "success",
          title: "Added to Cart!",
          message: `${product.name} quantity updated in cart`,
        })
        return updatedCart
      }
      addNotification({
        type: "success",
        title: "Added to Cart!",
        message: `${product.name} has been added to your cart`,
      })
      return [
        ...prevCart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
        },
      ]
    })
  }

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => {
      const item = prevCart.find((item) => item.id === productId)
      if (item) {
        addNotification({
          type: "info",
          title: "Removed from Cart",
          message: `${item.name} has been removed from your cart`,
        })
      }
      return prevCart.filter((item) => item.id !== productId)
    })
  }

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(productId)
      return
    }
    setCart((prevCart) => prevCart.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)))
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  // Checkout functions
  const handleCheckout = () => {
    if (cart.length === 0) {
      addNotification({
        type: "error",
        title: "Cart Empty",
        message: "Please add some products to your cart before checkout",
      })
      return
    }
    if (!user) {
      addNotification({
        type: "info",
        title: "Login Required",
        message: "Please login to continue with checkout",
      })
      window.location.href = "/login"
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
      addNotification({
        type: "error",
        title: "Form Incomplete",
        message: "Please fill in all required fields",
      })
      return
    }

    if (!user?.id) {
      setPaymentError("Please log in to continue")
      addNotification({
        type: "error",
        title: "Authentication Required",
        message: "Please log in to continue with payment",
      })
      return
    }

    if (cart.length === 0) {
      setPaymentError("Your cart is empty")
      addNotification({
        type: "error",
        title: "Cart Empty",
        message: "Your cart is empty. Please add products before checkout",
      })
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

      console.log("📦 Order payload:", {
        amount: orderPayload.amount,
        currency: orderPayload.currency,
        receipt: orderPayload.receipt,
        receiptLength: orderPayload.receipt.length,
        userId: orderPayload.userId,
        itemsCount: orderPayload.orderData.items.length,
      })

      // Create order via API
      const orderResponse = await fetch("/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(orderPayload),
      })

      console.log("📡 Order response status:", orderResponse.status)

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
      console.log("✅ Order response data:", orderData)

      if (!orderData.success) {
        throw new Error(orderData.details || orderData.error || "Failed to create order")
      }

      if (!orderData.razorpayOrder || !orderData.razorpayOrder.id) {
        console.error("❌ Invalid order response:", orderData)
        throw new Error("Invalid order response from server")
      }

      console.log("💳 Initiating Razorpay payment...")

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
            console.log("✅ Payment successful, verifying...")

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
            console.log("✅ Verification response:", verifyData)

            if (verifyData.success) {
              console.log("🎉 Payment verified successfully")
              setOrderSuccess(true)
              setCart([])
              setIsCheckoutOpen(false)
              setCheckoutForm({ name: "", email: "", phone: "", address: "" })
              addNotification({
                type: "success",
                title: "Order Placed Successfully!",
                message: "Your order has been confirmed and you will receive an email shortly",
              })
            } else {
              throw new Error(verifyData.error || "Payment verification failed")
            }
          } catch (error: any) {
            console.error("❌ Payment verification error:", error)
            setPaymentError(error.message || "Payment verification failed")
            addNotification({
              type: "error",
              title: "Payment Verification Failed",
              message: error.message || "Payment verification failed",
            })
          } finally {
            setIsProcessingPayment(false)
          }
        },
        onError: (error: any) => {
          console.error("❌ Payment error:", error)
          const errorMessage = error.description || error.error || "Payment failed"
          setPaymentError(errorMessage)
          addNotification({
            type: "error",
            title: "Payment Failed",
            message: errorMessage,
          })
          setIsProcessingPayment(false)
        },
      })
    } catch (error: any) {
      console.error("❌ Payment process error:", error)
      const errorMessage = error.message || "Failed to process payment"
      setPaymentError(errorMessage)
      addNotification({
        type: "error",
        title: "Payment Error",
        message: errorMessage,
      })
      setIsProcessingPayment(false)
    }
  }

  // Scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fadeInUp")
        }
      })
    }, observerOptions)

    const elements = document.querySelectorAll(".scroll-animate")
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-[100] space-y-2">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 300, scale: 0.3 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.5 }}
              className={`p-4 rounded-xl shadow-lg max-w-sm ${
                notification.type === "success"
                  ? "bg-green-500 text-white"
                  : notification.type === "error"
                    ? "bg-red-500 text-white"
                    : "bg-blue-500 text-white"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{notification.title}</h4>
                  <p className="text-xs opacity-90 mt-1">{notification.message}</p>
                </div>
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="ml-2 opacity-70 hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-emerald-800 via-emerald-900 to-green-900 text-white backdrop-blur-md shadow-lg border-b border-emerald-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-25%20153324.jpg-S8ULBXQxRku2nldAM9Q4PiLEhjr55f.png"
                alt="SPARSH by R Naturals - Premium Natural Hair Care"
                className="h-14 w-auto max-w-[160px] object-contain"
              />
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#products"
                className="text-white hover:text-emerald-200 transition-colors font-medium"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                Products
              </a>
              <a
                href="#about"
                className="text-white hover:text-emerald-200 transition-colors font-medium"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                About
              </a>
              <a href="/contact" className="text-white hover:text-emerald-200 transition-colors font-medium">
                Contact
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCartOpen(true)}
                className="relative text-white hover:bg-emerald-700 transition-all-300 hover-3d"
              >
                <ShoppingCart className="w-5 h-5" />
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-emerald-400 text-emerald-900 text-xs animate-pulse-slow">
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>

              {/* User Menu */}
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="hidden md:block text-sm text-emerald-100 font-medium">
                    Hello, {user.user_metadata?.full_name || user.email?.split("@")[0] || "User"}
                  </span>
                  <Button
                    variant="ghost"
                    onClick={() => (window.location.href = "/profile")}
                    className="text-white hover:bg-emerald-700 transition-all-300"
                  >
                    Profile
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={signOut}
                    className="text-white hover:bg-emerald-700 transition-all-300"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="hidden md:flex space-x-2">
                  <Button
                    variant="ghost"
                    onClick={() => (window.location.href = "/login")}
                    className="text-white hover:bg-emerald-700 transition-all-300"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => (window.location.href = "/signup")}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white transition-all-300 btn-press"
                  >
                    Sign Up
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-white hover:bg-emerald-700 md:hidden transition-all-300"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-300 rounded-full organic-shape animate-float"></div>
          <div
            className="absolute bottom-20 right-10 w-24 h-24 bg-green-300 rounded-full organic-shape-2 animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium shadow-soft"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>100% Natural Hair Care</span>
                </motion.div>

                <h1 className="font-heading text-responsive-5xl font-bold leading-tight">
                  <span className="gradient-text">Transform Your Hair</span>
                  <br />
                  <span className="text-gray-800">Naturally</span>
                </h1>

                <p className="text-responsive-lg text-gray-600 leading-relaxed font-body">
                  At SPARSH by R Naturals, we handcraft premium hair care products using time-tested natural ingredients
                  and gentle, home-based methods. Each formula is carefully curated to nourish your scalp, promote
                  healthy growth, and restore shine—without harsh chemicals.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-8 py-4 rounded-xl shadow-green hover-3d transition-all-300 btn-press font-semibold"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Shop Now
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 px-8 py-4 rounded-xl transition-all-300 btn-press font-semibold"
                >
                  Learn More
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                {[
                  { number: "500+", label: "Happy Customers" },
                  { number: "4.8★", label: "Average Rating" },
                  { number: "100%", label: "Natural" },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-responsive-2xl font-bold text-emerald-600 font-heading">{stat.number}</div>
                    <div className="text-responsive-sm text-gray-600 font-body">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 image-hover">
                <img
                  src="https://media.gettyimages.com/id/1151392246/photo/natural-cosmetics-ingredients-for-skincare-body-and-hair-care.jpg?s=612x612&w=0&k=20&c=n9dtIg-dy8rHCQdc_RKqa93lpRsCvBnOlt8fuc0dZ7M="
                  alt="Natural Hair Care Products - Organic ingredients for healthy hair"
                  className="w-full h-auto rounded-3xl shadow-strong"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/20 to-transparent rounded-3xl transform rotate-3 scale-105 -z-10" />
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-emerald-200 rounded-full opacity-60 animate-bounce-slow" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 scroll-animate">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-responsive-3xl font-bold mb-4 gradient-text">Why Choose SPARSH?</h2>
            <p className="text-responsive-lg text-gray-600 max-w-2xl mx-auto font-body">
              We're committed to providing the highest quality natural hair care products that deliver real results.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Leaf,
                title: "100% Natural",
                description: "Organic ingredients sourced from nature's finest suppliers",
                color: "emerald",
              },
              {
                icon: Shield,
                title: "Chemical-Free",
                description: "No harmful chemicals, sulfates, or parabens in any product",
                color: "green",
              },
              {
                icon: Hand,
                title: "Handmade with Care",
                description: "Crafted in small batches for premium quality and freshness",
                color: "teal",
              },
              {
                icon: Award,
                title: "Proven Results",
                description: "Trusted by many with visible hair transformation",
                color: "emerald",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl glass shadow-soft hover-3d transition-all-300 group"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br from-${feature.color}-500 to-${feature.color}-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform-300`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-heading text-responsive-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-responsive-sm text-gray-600 font-body">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 scroll-animate">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-responsive-4xl font-bold mb-4 gradient-text">Our Products</h2>
            <p className="text-responsive-xl text-gray-600 max-w-2xl mx-auto font-body">
              Discover our range of premium natural hair care products designed to nourish and transform your hair
            </p>
          </motion.div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-emerald-200 focus:border-emerald-400 rounded-xl font-body"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["All", "Hair Care", "Oil", "Gel", "Mask", "Dye"].map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={`transition-all-300 btn-press font-medium ${
                    selectedCategory === category
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-green"
                      : "border-emerald-200 hover:bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  <Card className="h-full glass shadow-soft hover-3d transition-all-300 border-0 rounded-3xl overflow-hidden">
                    <div className="relative overflow-hidden image-hover">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={`${product.name} - ${product.description}`}
                        className="w-full h-64 object-contain p-4 transition-transform-300"
                      />
                      {product.featured && (
                        <Badge className="absolute top-4 left-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white">
                          Featured
                        </Badge>
                      )}
                      {product.originalPrice > product.price && (
                        <Badge className="absolute top-4 right-4 bg-red-500 text-white">
                          {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 font-medium">
                              {product.category}
                            </Badge>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                                  }`}
                                />
                              ))}
                              <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
                            </div>
                          </div>
                          <h3 className="font-heading text-responsive-xl font-semibold text-gray-800 mb-2">
                            {product.name}
                          </h3>
                          <p className="text-responsive-sm text-gray-600 mb-4 line-clamp-2 font-body">
                            {product.description}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <span className="font-heading text-responsive-2xl font-bold text-emerald-600">
                              ₹{product.price.toLocaleString()}
                            </span>
                            {product.originalPrice > product.price && (
                              <span className="text-responsive-base text-gray-400 line-through font-body">
                                ₹{product.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          onClick={() => addToCart(product)}
                          disabled={!product.inStock}
                          className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl transition-all-300 btn-press font-semibold"
                        >
                          {product.inStock ? (
                            <>
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Add to Cart
                            </>
                          ) : (
                            "Out of Stock"
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredProducts.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="font-heading text-responsive-xl font-semibold text-gray-600 mb-2">No products found</h3>
              <p className="text-responsive-base text-gray-500 font-body">
                Try adjusting your search or filter criteria
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white/50 scroll-animate">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <h2 className="font-heading text-responsive-4xl font-bold leading-tight">
                  Crafted with Love,
                  <span className="block gradient-text">Inspired by Nature</span>
                </h2>
                <p className="text-responsive-lg text-gray-600 leading-relaxed font-body">
                  At SPARSH, we believe that nature holds the key to beautiful, healthy hair. Our products are carefully
                  crafted using traditional Ayurvedic recipes and the finest natural ingredients.
                </p>
                <p className="text-responsive-lg text-gray-600 leading-relaxed font-body">
                  Every bottle is a testament to our commitment to purity, quality, and your hair's well-being. We
                  source our ingredients ethically and ensure that every product is free from harmful chemicals.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {[
                  { number: "2+", label: "Years of Research", color: "emerald" },
                  { number: "15+", label: "Natural Ingredients", color: "green" },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`text-center p-4 bg-${stat.color}-50 rounded-2xl hover-3d transition-all-300`}
                  >
                    <div className={`font-heading text-responsive-2xl font-bold text-${stat.color}-600 mb-1`}>
                      {stat.number}
                    </div>
                    <div className="text-responsive-sm text-gray-600 font-body">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              <Button
                size="lg"
                onClick={() => (window.location.href = "/hair-solutions")}
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white transition-all-300 btn-press font-semibold"
              >
                Learn More About Our Process
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative z-10 image-hover">
                <img
                  src="https://media.gettyimages.com/id/2159339151/photo/set-of-cosmetic-products-made-from-hemp-leaf-extract-face-serum-massage-oil-natural-soap-hair.jpg?s=612x612&w=0&k=20&c=ASa9zLAMV--lI3YeIfh1A3yxCp_CSo6cHqVykJV22gY="
                  alt="Natural Hair Care Ingredients - Organic botanical extracts"
                  className="w-full h-auto rounded-3xl shadow-strong"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-green-600/10 rounded-3xl transform -rotate-3 scale-105 -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-green-600 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-40 h-40 bg-white rounded-full organic-shape animate-float"></div>
          <div
            className="absolute bottom-10 right-20 w-32 h-32 bg-white rounded-full organic-shape-2 animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <h2 className="font-heading text-responsive-4xl font-bold">Ready to Transform Your Hair?</h2>
            <p className="text-responsive-xl opacity-90 font-body">
              Join thousands of satisfied customers and experience the power of natural hair care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
                className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold transition-all-300 btn-press"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Shop Now
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => (window.location.href = "/contact")}
                className="border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-4 text-lg font-semibold transition-all-300 btn-press"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Get Expert Advice
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Floating Chat Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2 }}
        className="fixed bottom-6 left-6 z-40"
      >
        <Button
          size="icon"
          className="w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-strong animate-pulse-slow hover-3d"
          onClick={() => (window.location.href = "/contact")}
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </motion.div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-25%20153324.jpg-S8ULBXQxRku2nldAM9Q4PiLEhjr55f.png"
                alt="SPARSH by R Naturals Logo"
                className="h-14 w-auto max-w-[160px] object-contain"
              />
              <p className="text-gray-400 font-body">
                Transform your hair naturally with our premium organic hair care products crafted with love and care.
              </p>
              <div className="flex space-x-4">
                <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white transition-colors">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white transition-colors">
                  <Mail className="w-5 h-5" />
                </Button>
                <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white transition-colors">
                  <MapPin className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-heading text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 font-body">
                <li>
                  <a href="#products" className="text-gray-400 hover:text-white transition-colors">
                    Products
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-gray-400 hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-gray-400 hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="/returns" className="text-gray-400 hover:text-white transition-colors">
                    Returns
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-heading text-lg font-semibold mb-4">Customer Care</h3>
              <ul className="space-y-2 font-body">
                <li>
                  <a href="/contact" className="text-gray-400 hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="/hair-solutions" className="text-gray-400 hover:text-white transition-colors">
                    Hair Solutions
                  </a>
                </li>
                <li>
                  <a href="/returns" className="text-gray-400 hover:text-white transition-colors">
                    Returns & Exchanges
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="text-gray-400 hover:text-white transition-colors">
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-heading text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-3 text-gray-400 font-body">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>+91 9409073136</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-emerald-400" />
                  <span>rs.sparshnaturals@gmail.com</span>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-emerald-400 mt-1" />
                  <span>Bhavnagar, Gujarat, India</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400 font-body">
              © 2025 SPARSH Natural Hair Care. All rights reserved. <br /> Made with ❤️ for beautiful hair.
            </p>
          </div>
        </div>
      </footer>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsCartOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl"
            >
              <div className="flex flex-col h-full">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="font-heading text-2xl font-bold">Shopping Cart</h2>
                    <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)} className="hover-3d">
                      <X className="w-6 h-6" />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  {cart.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingCart className="w-12 h-12 text-gray-400" />
                      </div>
                      <h3 className="font-heading text-lg font-semibold text-gray-600 mb-2">Your cart is empty</h3>
                      <p className="text-gray-500 font-body mb-6">Add some products to get started</p>
                      <Button
                        onClick={() => {
                          setIsCartOpen(false)
                          document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white transition-all-300 btn-press"
                      >
                        Continue Shopping
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl hover-3d transition-all-300"
                        >
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-16 h-16 object-contain rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-heading font-semibold text-gray-800">{item.name}</h3>
                            <p className="text-emerald-600 font-bold font-body">₹{item.price.toLocaleString()}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 hover-3d transition-all-300"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-8 text-center font-medium font-body">{item.quantity}</span>
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 hover-3d transition-all-300"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 hover-3d transition-all-300"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="p-6 border-t space-y-4">
                    <div className="flex items-center justify-between text-xl font-bold">
                      <span className="font-heading">Total:</span>
                      <span className="text-emerald-600 font-heading">₹{getTotalPrice().toLocaleString()}</span>
                    </div>
                    <Button
                      onClick={handleCheckout}
                      className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-3 rounded-xl transition-all-300 btn-press font-semibold"
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      Proceed to Checkout
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsCheckoutOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="font-heading text-2xl font-bold">Checkout</h2>
                    <Button variant="ghost" size="icon" onClick={() => setIsCheckoutOpen(false)} className="hover-3d">
                      <X className="w-6 h-6" />
                    </Button>
                  </div>
                </div>

                <div className="p-6">
                  {paymentError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{paymentError}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 font-body">Full Name *</label>
                      <Input
                        type="text"
                        value={checkoutForm.name}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                        className="border-emerald-200 focus:border-emerald-400 font-body"
                        required
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 font-body">Email *</label>
                      <Input
                        type="email"
                        value={checkoutForm.email}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                        className="border-emerald-200 focus:border-emerald-400 font-body"
                        required
                        placeholder="Enter your email address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 font-body">Phone Number *</label>
                      <Input
                        type="tel"
                        value={checkoutForm.phone}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                        className="border-emerald-200 focus:border-emerald-400 font-body"
                        required
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 font-body">
                        Shipping Address *
                      </label>
                      <textarea
                        value={checkoutForm.address}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                        className="w-full p-3 border border-emerald-200 rounded-xl focus:border-emerald-400 focus:outline-none font-body"
                        rows={3}
                        required
                        placeholder="Enter your complete shipping address"
                      />
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-heading font-semibold mb-2">Order Summary</h3>
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm mb-1 font-body">
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                        <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-bold">
                        <span className="font-heading">Total:</span>
                        <span className="text-emerald-600 font-heading">₹{getTotalPrice().toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={processPayment}
                    disabled={isProcessingPayment}
                    className="w-full mt-6 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-3 rounded-xl transition-all-300 btn-press font-semibold"
                  >
                    {isProcessingPayment ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        Pay with Razorpay
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {orderSuccess && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </motion.div>
                <h2 className="font-heading text-2xl font-bold text-gray-800 mb-4">Order Successful!</h2>
                <p className="text-gray-600 mb-6 font-body">
                  Thank you for your purchase. Your order has been confirmed and you will receive an email confirmation
                  shortly.
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      setOrderSuccess(false)
                      window.location.href = "/orders"
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white transition-all-300 btn-press font-semibold"
                  >
                    View Orders
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setOrderSuccess(false)
                      document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })
                    }}
                    className="w-full border-emerald-200 hover:bg-emerald-50 transition-all-300 btn-press font-semibold"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="fixed left-0 top-0 h-full w-80 bg-white z-50 shadow-2xl md:hidden"
            >
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Leaf className="w-8 h-8 text-emerald-600" />
                    <span className="font-heading text-2xl font-bold gradient-text">SPARSH</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} className="hover-3d">
                    <X className="w-6 h-6" />
                  </Button>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 border-emerald-200 focus:border-emerald-400 font-body"
                    />
                  </div>
                  <nav className="space-y-2">
                    <a
                      href="#products"
                      className="block py-2 text-gray-700 hover:text-emerald-600 transition-colors font-medium font-body"
                      onClick={(e) => {
                        e.preventDefault()
                        setIsMobileMenuOpen(false)
                        document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })
                      }}
                    >
                      Products
                    </a>
                    <a
                      href="#about"
                      className="block py-2 text-gray-700 hover:text-emerald-600 transition-colors font-medium font-body"
                      onClick={(e) => {
                        e.preventDefault()
                        setIsMobileMenuOpen(false)
                        document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
                      }}
                    >
                      About
                    </a>
                    <a
                      href="/contact"
                      className="block py-2 text-gray-700 hover:text-emerald-600 transition-colors font-medium font-body"
                    >
                      Contact
                    </a>
                    {user && (
                      <>
                        <a
                          href="/profile"
                          className="block py-2 text-gray-700 hover:text-emerald-600 transition-colors font-medium font-body"
                        >
                          Profile
                        </a>
                        <a
                          href="/orders"
                          className="block py-2 text-gray-700 hover:text-emerald-600 transition-colors font-medium font-body"
                        >
                          Orders
                        </a>
                      </>
                    )}
                  </nav>
                  {!user && (
                    <div className="space-y-2 pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => (window.location.href = "/login")}
                        className="w-full border-emerald-200 hover:bg-emerald-50 transition-all-300 btn-press font-semibold"
                      >
                        Login
                      </Button>
                      <Button
                        onClick={() => (window.location.href = "/signup")}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white transition-all-300 btn-press font-semibold"
                      >
                        Sign Up
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
