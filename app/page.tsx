"use client"

import { useState } from "react"
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
  Star,
  Leaf,
  Shield,
  Hand,
  Sun,
  Heart,
  Search,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  AlertCircle,
  CreditCard,
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { PaymentService } from "@/components/payment-service"

// Safe Supabase import with error handling
let supabase: any = null
try {
  const { supabase: supabaseClient } = require("@/lib/supabase")
  supabase = supabaseClient
} catch (error) {
  console.warn("Supabase not configured, running in demo mode")
}

// Product data
const products = [
  {
    id: 1,
    name: "Shampoo",
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
  },
  {
    id: 2,
    name: "Green Mask",
    price: 300,
    originalPrice: 699,
    image:
      "https://images.unsplash.com/photo-1748104313770-356af1cda480?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8M3x8fGVufDB8fHx8fA%3D%3D",
    description: "Intensive keratin treatment shampoo for damaged hair",
    benefits: ["Repairs damage", "Strengthens hair", "Reduces breakage"],
    ingredients: ["Keratin", "Biotin", "Coconut Oil"],
    inStock: true,
    featured: false,
    category: "Mask",
  },
  {
    id: 3,
    name: "Hair Oil",
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
  },
  {
    id: 4,
    name: "Hair Psoriasis Mask",
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
  },
  {
    id: 5,
    name: "Back Aloe Vera Gel",
    price: 250,
    originalPrice: 599,
    image:
      "https://images.unsplash.com/photo-1748104313831-12100b94aba2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8OHx8fGVufDB8fHx8fA%3D%3D",
    description: "Ayurvedic hair growth oil with 12 natural herbs",
    benefits: ["Stimulates growth", "Reduces hair fall", "Strengthens roots"],
    ingredients: ["Bhringraj", "Amla", "Fenugreek"],
    inStock: true,
    featured: false,
    category: "Gel",
  },
  {
    id: 6,
    name: "Hair Smoothing Mask",
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
  },
  {
    id: 7,
    name: "Natural Hair Dye",
    price: 540,
    originalPrice: 749,
    image:
      "https://images.unsplash.com/photo-1748104313975-53931e0743b2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8Nnx8fGVufDB8fHx8fA%3D%3D",
    description: "Natural hair dye with organic ingredients",
    benefits: ["Chemical-free coloring", "Long-lasting", "Hair-friendly"],
    ingredients: ["Henna", "Indigo", "Amla"],
    inStock: true,
    featured: false,
    category: "Dye",
  },
  {
    id: 8,
    name: "Aloe Vera Gel",
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
  },
  {
    id: 9,
    name: "Keratin Mask",
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
  },
]

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

  const { user, signOut } = useAuth()

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Cart functions
  const addToCart = (product: any) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)
      if (existingItem) {
        return prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
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
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId))
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
    if (cart.length === 0) return
    if (!user) {
      // Redirect to login
      window.location.href = "/login"
      return
    }
    setIsCheckoutOpen(true)
    setIsCartOpen(false)
  }

  const processPayment = async () => {
    if (!checkoutForm.name || !checkoutForm.email || !checkoutForm.phone || !checkoutForm.address) {
      setPaymentError("Please fill in all required fields")
      return
    }

    setIsProcessingPayment(true)
    setPaymentError("")

    try {
      console.log("Creating Razorpay order...")

      // Create Razorpay order
      const orderResponse = await fetch("/api/create-razorpay-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          amount: getTotalPrice(),
          currency: "INR",
          receipt: `order_${Date.now()}`,
          userId: user?.id,
          orderData: {
            customerName: checkoutForm.name,
            customerEmail: checkoutForm.email,
            customerPhone: checkoutForm.phone,
            shippingAddress: checkoutForm.address,
            items: cart,
          },
        }),
      })

      console.log("Order response status:", orderResponse.status)

      // Check if response is ok
      if (!orderResponse.ok) {
        const errorText = await orderResponse.text()
        console.error("Order creation failed:", errorText)
        throw new Error(`Server error (${orderResponse.status}): ${orderResponse.statusText}`)
      }

      // Check content type
      const contentType = orderResponse.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const responseText = await orderResponse.text()
        console.error("Non-JSON response:", responseText)
        throw new Error("Server returned invalid response format")
      }

      const orderData = await orderResponse.json()
      console.log("Order response data:", orderData)

      if (!orderData.success) {
        throw new Error(orderData.error || "Failed to create order")
      }

      if (!orderData.razorpayOrder || !orderData.razorpayOrder.id) {
        console.error("Invalid order response:", orderData)
        throw new Error("Invalid order response from server")
      }

      console.log("Initiating Razorpay payment...")

      // Initiate Razorpay payment
      await PaymentService.initiatePayment({
        amount: getTotalPrice(),
        currency: "INR",
        orderId: orderData.razorpayOrder.id,
        customerName: checkoutForm.name,
        customerEmail: checkoutForm.email,
        customerPhone: checkoutForm.phone,
        onSuccess: async (response: any) => {
          try {
            console.log("Payment successful, verifying...")

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
              console.error("Verification failed:", errorText)
              throw new Error(`Verification failed (${verifyResponse.status})`)
            }

            const verifyData = await verifyResponse.json()
            console.log("Verification response:", verifyData)

            if (verifyData.success) {
              console.log("Payment verified successfully")
              setOrderSuccess(true)
              setCart([])
              setIsCheckoutOpen(false)
              setCheckoutForm({ name: "", email: "", phone: "", address: "" })
            } else {
              throw new Error(verifyData.error || "Payment verification failed")
            }
          } catch (error: any) {
            console.error("Payment verification error:", error)
            setPaymentError(error.message || "Payment verification failed")
          } finally {
            setIsProcessingPayment(false)
          }
        },
        onError: (error: any) => {
          console.error("Payment error:", error)
          setPaymentError(error.description || error.error || "Payment failed")
          setIsProcessingPayment(false)
        },
      })
    } catch (error: any) {
      console.error("Payment process error:", error)
      setPaymentError(error.message || "Failed to process payment")
      setIsProcessingPayment(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-emerald-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Leaf className="w-8 h-8 text-emerald-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                SPARSH
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {user && (
                <>
                  <a href="/orders" className="text-gray-700 hover:text-emerald-600 transition-colors">
                    Orders
                  </a>
                  <a href="/profile" className="text-gray-700 hover:text-emerald-600 transition-colors">
                    Profile
                  </a>
                </>
              )}
            </nav>

            <div className="flex items-center space-x-4">
              {/* Cart */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsCartOpen(true)}
                className="relative border-emerald-200 hover:bg-emerald-50"
              >
                <ShoppingCart className="w-5 h-5" />
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs">
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>

              {/* User Menu */}
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="hidden md:block text-sm text-gray-600">
                    Hello, {user.user_metadata?.full_name || user.email?.split("@")[0] || "User"}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => (window.location.href = "/profile")}
                    className="border-emerald-200 hover:bg-emerald-50"
                  >
                    Profile
                  </Button>
                  <Button variant="outline" onClick={signOut} className="border-emerald-200 hover:bg-emerald-50">
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="hidden md:flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => (window.location.href = "/login")}
                    className="border-emerald-200 hover:bg-emerald-50"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => (window.location.href = "/signup")}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Sign Up
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden border-emerald-200"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                  Transform Your Hair
                </span>
                <br />
                <span className="text-gray-800">Naturally</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                At SPARSH by R Naturals, we handcraft premium hair care products using time-tested natural ingredients
                and gentle, home-based methods. Each formula is carefully curated to nourish your scalp, promote healthy
                growth, and restore shine—without harsh chemicals. Experience the purity of homemade care with results
                that speak for themselves.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-8 py-4 rounded-xl"
                >
                  Shop Now
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <img
                src="https://media.gettyimages.com/id/1151392246/photo/natural-cosmetics-ingredients-for-skincare-body-and-hair-care.jpg?s=612x612&w=0&k=20&c=n9dtIg-dy8rHCQdc_RKqa93lpRsCvBnOlt8fuc0dZ7M="
                alt="Natural Hair Care Products"
                className="w-full h-auto rounded-3xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/20 to-transparent rounded-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Leaf, title: "100% Natural", description: "Organic ingredients only" },
              { icon: Shield, title: "Herbal Products", description: "Safe for all hair types" },
              { icon: Hand, title: "Handmade with Care", description: "Crafted in small batches for best quality" },
              { icon: Sun, title: "Natural Glow", description: "Revive your hair with nature's goodness" },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow"
              >
                <feature.icon className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Our Products
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
                className="pl-10 border-emerald-200 focus:border-emerald-400"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["All", "Hair Care", "Treatment", "Oil", "Gel", "Mask", "Dye"].map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={
                    selectedCategory === category
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "border-emerald-200 hover:bg-emerald-50"
                  }
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
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Card className="h-full bg-white/95 backdrop-blur-md shadow-lg hover:shadow-2xl transition-all duration-300 border-0 rounded-3xl overflow-hidden">
                    <div className="relative overflow-hidden">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {product.featured && (
                        <Badge className="absolute top-4 left-4 bg-emerald-600 text-white">Featured</Badge>
                      )}
                      <div className="absolute top-4 right-4">
                        <Button size="icon" variant="secondary" className="bg-white/80 backdrop-blur-sm hover:bg-white">
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                          {product.category}
                        </Badge>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-gray-600 ml-1">
                            {product.rating} ({product.reviews})
                          </span>
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-emerald-600">₹{product.price.toLocaleString()}</span>
                          <span className="text-lg text-gray-400 line-through">
                            ₹{product.originalPrice.toLocaleString()}
                          </span>
                        </div>
                        <Badge className="bg-red-100 text-red-700">
                          {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                        </Badge>
                      </div>
                      <Button
                        onClick={() => addToCart(product)}
                        disabled={!product.inStock}
                        className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl"
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
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Leaf className="w-8 h-8 text-emerald-400" />
                <span className="text-2xl font-bold">SPARSH</span>
              </div>
              <p className="text-gray-400 mb-4">
                Transform your hair naturally with our premium organic hair care products.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#products" className="text-gray-400 hover:text-white transition-colors">
                    Products
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
              <h3 className="text-lg font-semibold mb-4">Customer Care</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/contact" className="text-gray-400 hover:text-white transition-colors">
                    Contact Us
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
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-2 text-gray-400">
                <p>📞 +91 9409073136</p>
                <p>📧 rs.sparshnaturals@gmail.com</p>
                <p>📍 Bhavnagar, Gujarat</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 SPARSH Natural Hair Care. All rights reserved.</p>
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
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Shopping Cart</h2>
                  <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)}>
                    <X className="w-6 h-6" />
                  </Button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-emerald-600 font-bold">₹{item.price.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {cart.length > 0 && (
                <div className="p-6 border-t">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold">Total:</span>
                    <span className="text-2xl font-bold text-emerald-600">₹{getTotalPrice().toLocaleString()}</span>
                  </div>
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-3 rounded-xl"
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Proceed to Checkout
                  </Button>
                </div>
              )}
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
                    <h2 className="text-2xl font-bold">Checkout</h2>
                    <Button variant="ghost" size="icon" onClick={() => setIsCheckoutOpen(false)}>
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <Input
                        type="text"
                        value={checkoutForm.name}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                        className="border-emerald-200 focus:border-emerald-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <Input
                        type="email"
                        value={checkoutForm.email}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                        className="border-emerald-200 focus:border-emerald-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                      <Input
                        type="tel"
                        value={checkoutForm.phone}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                        className="border-emerald-200 focus:border-emerald-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Address *</label>
                      <textarea
                        value={checkoutForm.address}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                        className="w-full p-3 border border-emerald-200 rounded-xl focus:border-emerald-400 focus:outline-none"
                        rows={3}
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-semibold mb-2">Order Summary</h3>
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm mb-1">
                        <span>
                          {item.name} x {item.quantity}
                        </span>
                        <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span className="text-emerald-600">₹{getTotalPrice().toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={processPayment}
                    disabled={isProcessingPayment}
                    className="w-full mt-6 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-3 rounded-xl"
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
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Successful!</h2>
                <p className="text-gray-600 mb-6">
                  Thank you for your purchase. Your order has been confirmed and you will receive an email confirmation
                  shortly.
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      setOrderSuccess(false)
                      window.location.href = "/orders"
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    View Orders
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setOrderSuccess(false)}
                    className="w-full border-emerald-200 hover:bg-emerald-50"
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
                    <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                      SPARSH
                    </span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
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
                      className="pl-10 border-emerald-200 focus:border-emerald-400"
                    />
                  </div>
                  <nav className="space-y-2">
                    <a href="#products" className="block py-2 text-gray-700 hover:text-emerald-600 transition-colors">
                      Products
                    </a>
                    <a href="/contact" className="block py-2 text-gray-700 hover:text-emerald-600 transition-colors">
                      Contact
                    </a>
                    {user && (
                      <>
                        <a href="/orders" className="block py-2 text-gray-700 hover:text-emerald-600 transition-colors">
                          Orders
                        </a>
                        <a
                          href="/profile"
                          className="block py-2 text-gray-700 hover:text-emerald-600 transition-colors"
                        >
                          Profile
                        </a>
                      </>
                    )}
                  </nav>
                  {!user && (
                    <div className="space-y-2 pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => (window.location.href = "/login")}
                        className="w-full border-emerald-200 hover:bg-emerald-50"
                      >
                        Login
                      </Button>
                      <Button
                        onClick={() => (window.location.href = "/signup")}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
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
