"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Plus,
  Minus,
  Trash2,
  LogIn,
  Eye,
  EyeOff,
  Heart,
  Leaf,
  LogOut,
  Package,
  UserCircle,
  AlertCircle,
  CheckCircle,
  Star,
  Sparkles,
  Shield,
  Award,
  Edit,
  Save,
  XCircle,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/lib/supabase"
import { EmailService } from "@/components/email-service"

interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  benefits: string[]
  ingredients: string[]
}

interface CartItem extends Product {
  quantity: number
}

interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  address: string | null
}

interface OrderItem {
  id: string
  order_id: string
  product_id: number
  product_name: string
  product_price: number
  quantity: number
}

interface Order {
  id: string
  user_id: string
  total_amount: number
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string
  created_at: string
  updated_at: string
  order_items?: OrderItem[]
}

const products: Product[] = [
  {
    id: 1,
    name: "Shampoo",
    description:
      "Luxurious moisturizing shampoo infused with pure Moroccan argan oil for deep nourishment and silky smooth hair",
    price: 300,
    image:
      "https://images.unsplash.com/photo-1748104313760-d051ffd69541?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8OXx8fGVufDB8fHx8fA%3D%3D",
    benefits: ["No harmful chemicals", "Prevents hairfall and dandruff", "Improves hair texture"],
    ingredients: ["Argan Oil", "Natural Extracts"],
  },
  {
    id: 2,
    name: "Green Mask",
    description: "For daily use, no need of hair wash after application.",
    price: 300,
    image:
      "https://images.unsplash.com/photo-1748104313770-356af1cda480?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8M3x8fGVufDB8fHx8fA%3D%3D",
    benefits: ["Silky hair", "Stops dandruff & hairfall"],
    ingredients: ["Natural Herbs", "Green Tea"],
  },
  {
    id: 3,
    name: "Hair Oil",
    description:
      "Potent blend of 21 traditional herbs and oils scientifically formulated to accelerate hair growth and prevent hair loss",
    price: 300,
    image:
      "https://images.unsplash.com/photo-1748104313828-159cbf71e6fe?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8NHx8fGVufDB8fHx8fA%3D%3D",
    benefits: ["Adds length & Volume to your hair"],
    ingredients: ["21 Traditional Herbs", "Essential Oils"],
  },
  {
    id: 4,
    name: "Hair Psoriasis Mask",
    description:
      "Therapeutic scalp treatment specially formulated to eliminate dandruff, soothe irritation, and restore scalp health",
    price: 300,
    image:
      "https://images.unsplash.com/photo-1748104313769-f4d38e95b9df?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8NXx8fGVufDB8fHx8fA%3D%3D",
    benefits: ["Stops spreading of psoriasis", "Stops itching"],
    ingredients: ["Therapeutic Herbs", "Anti-inflammatory Agents"],
  },
  {
    id: 5,
    name: "Black Aloe Vera Hair Gel",
    description: "Apply gel for 30 mins and than wash it.",
    price: 250,
    image:
      "https://images.unsplash.com/photo-1748104313858-e350edbef125?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8Mnx8fGVufDB8fHx8fA%3D%3D",
    benefits: ["Improves hair texture", "Enhance hair length and growth"],
    ingredients: ["Black Aloe Vera", "Natural Gels"],
  },
  {
    id: 6,
    name: "Hair Smoothing Mask",
    description: "Apply mask for 30 mins and than wash it.",
    price: 250,
    image:
      "https://images.unsplash.com/photo-1748104313816-29b1f3873451?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8N3x8fGVufDB8fHx8fA%3D%3D",
    benefits: ["Improves hair texture", "Enhances hair length"],
    ingredients: ["Smoothing Agents", "Natural Oils"],
  },
  {
    id: 7,
    name: "Natural Hair Dye",
    description:
      "Chemical-free hair dye made from henna and natural herbs for vibrant, long-lasting color without damage",
    price: 540,
    image:
      "https://images.unsplash.com/photo-1748104313975-53931e0743b2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8Nnx8fGVufDB8fHx8fA%3D%3D",
    benefits: ["Chemical Free", "Long Lasting", "Hair Strengthening", "Natural Coverage"],
    ingredients: ["Henna", "Natural Herbs", "Plant Extracts"],
  },
  {
    id: 8,
    name: "Aloe Vera Gel",
    description:
      "Lightweight, fast-absorbing serum with vitamin E and natural oils for instant shine and heat protection",
    price: 250,
    image:
      "https://images.unsplash.com/photo-1748104313831-12100b94aba2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8OHx8fGVufDB8fHx8fA%3D%3D",
    benefits: ["Instant Shine", "Heat Protection", "Non-Greasy", "Split End Repair"],
    ingredients: ["Aloe Vera", "Vitamin E", "Natural Oils"],
  },
  {
    id: 9,
    name: "Keratin Mask",
    description:
      "Rich, nourishing cream mask for severely damaged hair, providing intensive repair and moisture restoration",
    price: 250,
    image:
      "https://images.unsplash.com/photo-1748104313866-aff6443accb0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8MXx8fGVufDB8fHx8fA%3D%3D",
    benefits: ["Improves hair texture", "Enhances hair length"],
    ingredients: ["Keratin", "Nourishing Cream", "Repair Agents"],
  },
]

export default function SparshEcommerce() {
  const [currentPage, setCurrentPage] = useState<
    | "products"
    | "cart"
    | "login"
    | "signup"
    | "checkout"
    | "profile"
    | "orders"
    | "contact"
    | "returns"
    | "terms"
    | "privacy"
  >("products")
  const [cart, setCart] = useState<CartItem[]>([])
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [signupForm, setSignupForm] = useState({ name: "", email: "", password: "", confirmPassword: "" })
  const [checkoutForm, setCheckoutForm] = useState({ name: "", email: "", phone: "", address: "" })
  const [authError, setAuthError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [wishlist, setWishlist] = useState<number[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [productQuantities, setProductQuantities] = useState<{ [key: number]: number }>({})
  const [orderError, setOrderError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editProfileForm, setEditProfileForm] = useState({ name: "", phone: "", address: "" })
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isModifyingOrder, setIsModifyingOrder] = useState(false)
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" })
  const [contactError, setContactError] = useState("")
  const [isContactSubmitting, setIsContactSubmitting] = useState(false)
  const [returnRequest, setReturnRequest] = useState({ orderId: "", reason: "", items: "" })
  const [returnStatus, setReturnStatus] = useState<"pending" | "approved" | "rejected">("pending")
  const [faqExpanded, setFaqExpanded] = useState<number | null>(null)
  const [policyExpanded, setPolicyExpanded] = useState<number | null>(null)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetEmailSent, setResetEmailSent] = useState(false)

  const { user, loading, signUp, signIn, signOut, resetPassword, updateProfile, getProfile } = useAuth()
  const { scrollY } = useScroll()
  const headerOpacity = useTransform(scrollY, [0, 100], [0.85, 0.98])
  const headerBlur = useTransform(scrollY, [0, 100], [15, 25])

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Enhanced page navigation with scroll to top
  const navigateToPage = (page: typeof currentPage) => {
    setCurrentPage(page)
    scrollToTop()
    setIsMenuOpen(false) // Close mobile menu if open
  }

  // Initialize product quantities
  useEffect(() => {
    const initialQuantities: { [key: number]: number } = {}
    products.forEach((product) => {
      initialQuantities[product.id] = 1
    })
    setProductQuantities(initialQuantities)
  }, [])

  // Load user profile when user changes
  useEffect(() => {
    if (user) {
      loadProfile()
      loadOrders()
    } else {
      setProfile(null)
      setOrders([])
    }
  }, [user])

  // Pre-fill forms when profile loads
  useEffect(() => {
    if (profile) {
      setCheckoutForm({
        name: profile.full_name || "",
        email: profile.email,
        phone: profile.phone || "",
        address: profile.address || "",
      })
      setEditProfileForm({
        name: profile.full_name || "",
        phone: profile.phone || "",
        address: profile.address || "",
      })
    }
  }, [profile])

  const showMessage = (message: string, isError = false) => {
    if (isError) {
      setOrderError(message)
      setTimeout(() => setOrderError(""), 5000)
    } else {
      setSuccessMessage(message)
      setTimeout(() => setSuccessMessage(""), 5000)
    }
  }

  const loadProfile = async () => {
    try {
      if (!user?.id) {
        console.log("No user ID available")
        return
      }

      console.log("Loading profile for user:", user.id)

      // First check if profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle()

      if (fetchError) {
        console.error("Error fetching profile:", fetchError)
        return
      }

      if (existingProfile) {
        console.log("Profile found:", existingProfile)
        setProfile(existingProfile)
      } else {
        console.log("No profile found, creating new profile")
        // Create profile if it doesn't exist
        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert({
            id: user.id,
            email: user.email || "",
            full_name: null,
            phone: null,
            address: null,
          })
          .select()
          .single()

        if (createError) {
          console.error("Error creating profile:", createError)
          return
        }

        if (newProfile) {
          console.log("Profile created:", newProfile)
          setProfile(newProfile)
        }
      }
    } catch (error) {
      console.error("Error in loadProfile:", error)
    }
  }

  const loadOrders = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (*)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (data && !error) {
        setOrders(data)
      }
    } catch (error) {
      console.error("Error loading orders:", error)
    }
  }

  const updateProductQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) quantity = 1
    if (quantity > 99) quantity = 99
    setProductQuantities((prev) => ({
      ...prev,
      [productId]: quantity,
    }))
  }

  const addToCart = (product: Product) => {
    const quantity = productQuantities[product.id] || 1
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item))
      }
      return [...prev, { ...product, quantity }]
    })

    // Reset quantity to 1 after adding to cart
    setProductQuantities((prev) => ({
      ...prev,
      [product.id]: 1,
    }))

    showMessage(`Added ${quantity} ${product.name} to cart!`)
  }

  const toggleWishlist = (productId: number) => {
    setWishlist((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const clearCart = () => {
    setCart([])
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError("")
    setIsSubmitting(true)

    // Validate inputs
    if (!loginForm.email.trim() || !loginForm.password) {
      setAuthError("Please fill in all required fields")
      setIsSubmitting(false)
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(loginForm.email.trim())) {
      setAuthError("Please enter a valid email address")
      setIsSubmitting(false)
      return
    }

    try {
      console.log("Attempting login with:", loginForm.email.trim())

      const { data, error } = await signIn(loginForm.email.trim(), loginForm.password)

      if (error) {
        console.error("Login failed:", error)
        setAuthError(error.message)
      } else if (data?.user) {
        console.log("Login successful:", data.user.email)

        // Send login notification email
        try {
          await EmailService.sendLoginNotification({
            email: data.user.email,
            full_name: data.user.user_metadata?.full_name || profile?.full_name,
            ip_address: "Not available",
            user_agent: navigator.userAgent,
          })
        } catch (emailError) {
          console.error("Failed to send login notification:", emailError)
          // Don't fail login if email fails
        }

        navigateToPage("products")
        setLoginForm({ email: "", password: "" })
        showMessage("Welcome back! Login successful.")
      } else {
        setAuthError("Login failed. Please check your credentials.")
      }
    } catch (error: any) {
      console.error("Login exception:", error)
      setAuthError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError("")
    setIsSubmitting(true)

    // Validate inputs
    if (!signupForm.name.trim() || !signupForm.email.trim() || !signupForm.password) {
      setAuthError("Please fill in all required fields")
      setIsSubmitting(false)
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(signupForm.email.trim())) {
      setAuthError("Please enter a valid email address")
      setIsSubmitting(false)
      return
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      setAuthError("Passwords do not match")
      setIsSubmitting(false)
      return
    }

    if (signupForm.password.length < 6) {
      setAuthError("Password must be at least 6 characters long")
      setIsSubmitting(false)
      return
    }

    try {
      const { data, error } = await signUp(signupForm.email.trim(), signupForm.password, signupForm.name.trim())

      if (error) {
        console.error("Signup failed:", error)
        setAuthError(error.message)
      } else {
        navigateToPage("products")
        setSignupForm({ name: "", email: "", password: "", confirmPassword: "" })
        showMessage("Account created successfully! Please check your email to verify your account.")
      }
    } catch (error: any) {
      console.error("Signup exception:", error)
      setAuthError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError("")
    setIsSubmitting(true)

    if (!resetEmail.trim()) {
      setAuthError("Please enter your email address")
      setIsSubmitting(false)
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(resetEmail.trim())) {
      setAuthError("Please enter a valid email address")
      setIsSubmitting(false)
      return
    }

    try {
      const { error } = await resetPassword(resetEmail.trim())

      if (error) {
        setAuthError(error.message)
      } else {
        // Send password reset notification
        try {
          await EmailService.sendPasswordResetNotification({
            email: resetEmail.trim(),
            ip_address: "Not available",
          })
        } catch (emailError) {
          console.error("Failed to send password reset notification:", emailError)
        }

        setResetEmailSent(true)
        showMessage("Password reset email sent! Please check your inbox.")
      }
    } catch (error: any) {
      console.error("Password reset exception:", error)
      setAuthError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      navigateToPage("products")
      clearCart()
      showMessage("Logged out successfully")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  const handleProfileEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setOrderError("")

    try {
      if (!user?.id) {
        throw new Error("No user logged in")
      }

      console.log("Updating profile for user:", user.id)

      const { data: updatedProfile, error } = await supabase
        .from("profiles")
        .update({
          full_name: editProfileForm.name.trim(),
          phone: editProfileForm.phone.trim(),
          address: editProfileForm.address.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select()
        .single()

      if (error) {
        console.error("Profile update error:", error)
        throw new Error(`Failed to update profile: ${error.message}`)
      }

      if (updatedProfile) {
        setProfile(updatedProfile)
        setIsEditingProfile(false)

        // Send account update notification
        try {
          await EmailService.sendAccountUpdateNotification(updatedProfile, "Profile Information")
        } catch (emailError) {
          console.error("Failed to send account update notification:", emailError)
        }

        showMessage("Profile updated successfully!")
      }
    } catch (error: any) {
      console.error("Profile update error:", error)
      showMessage(error.message || "An error occurred while updating profile", true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setOrderError("")

    if (!user?.id) {
      console.log("No user logged in")
      navigateToPage("login")
      return
    }

    if (cart.length === 0) {
      setOrderError("Your cart is empty")
      return
    }

    if (!checkoutForm.name || !checkoutForm.email || !checkoutForm.phone || !checkoutForm.address) {
      setOrderError("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    try {
      console.log("Creating order for user:", user.id)

      // Create order in Supabase
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total_amount: getTotalPrice(),
          customer_name: checkoutForm.name.trim(),
          customer_email: checkoutForm.email.trim(),
          customer_phone: checkoutForm.phone.trim(),
          shipping_address: checkoutForm.address.trim(),
          status: "pending",
        })
        .select()
        .single()

      if (orderError) {
        throw new Error(`Failed to create order: ${orderError.message}`)
      }

      if (!order) {
        throw new Error("No order data returned from database")
      }

      // Create order items
      const orderItems = cart.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_price: item.price,
        quantity: item.quantity,
      }))

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

      if (itemsError) {
        throw new Error(`Failed to create order items: ${itemsError.message}`)
      }

      // Prepare order details for email
      const orderDetails = {
        customer_name: checkoutForm.name.trim(),
        customer_email: checkoutForm.email.trim(),
        customer_phone: checkoutForm.phone.trim(),
        shipping_address: checkoutForm.address.trim(),
        total_amount: getTotalPrice(),
        order_items: cart.map((item) => ({
          product_name: item.name,
          product_price: item.price,
          quantity: item.quantity,
          subtotal: item.price * item.quantity,
        })),
        order_date: new Date().toISOString(),
        user_id: user.id,
        order_id: order.id,
      }

      // Send email notifications
      try {
        await EmailService.sendOrderConfirmation(orderDetails)
      } catch (emailError) {
        console.error("Email sending failed:", emailError)
      }

      await loadOrders()
      clearCart()
      showMessage("Order placed successfully! Check your email for confirmation.")
      navigateToPage("orders")
    } catch (error: any) {
      console.error("Error placing order:", error)
      setOrderError(error.message || "There was an error submitting your order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancelOrder = async (order: Order) => {
    if (!user || order.status === "cancelled") return

    setIsSubmitting(true)

    try {
      // Update order status
      const { error } = await supabase
        .from("orders")
        .update({ status: "cancelled", updated_at: new Date().toISOString() })
        .eq("id", order.id)

      if (error) {
        throw new Error("Failed to cancel order")
      }

      // Prepare order details for email
      const orderDetails = {
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        customer_phone: order.customer_phone,
        shipping_address: order.shipping_address,
        total_amount: order.total_amount,
        order_items:
          order.order_items?.map((item) => ({
            product_name: item.product_name,
            product_price: item.product_price,
            quantity: item.quantity,
            subtotal: item.product_price * item.quantity,
          })) || [],
        order_date: order.created_at,
        user_id: order.user_id,
        order_id: order.id,
      }

      // Send cancellation emails
      await EmailService.sendOrderCancellation(orderDetails)

      await loadOrders()
      showMessage("Order cancelled successfully. Confirmation emails have been sent.")
    } catch (error) {
      console.error("Error cancelling order:", error)
      showMessage("Failed to cancel order. Please try again.", true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleModifyOrder = async (order: Order, newItems: CartItem[]) => {
    if (!user || order.status === "cancelled" || order.status === "delivered") return

    setIsSubmitting(true)

    try {
      const newTotal = newItems.reduce((total, item) => total + item.price * item.quantity, 0)

      // Update order total
      const { error: orderError } = await supabase
        .from("orders")
        .update({ total_amount: newTotal, updated_at: new Date().toISOString() })
        .eq("id", order.id)

      if (orderError) {
        throw new Error("Failed to update order")
      }

      // Delete existing order items
      const { error: deleteError } = await supabase.from("order_items").delete().eq("order_id", order.id)

      if (deleteError) {
        throw new Error("Failed to update order items")
      }

      // Insert new order items
      const orderItems = newItems.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_price: item.price,
        quantity: item.quantity,
      }))

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

      if (itemsError) {
        throw new Error("Failed to create new order items")
      }

      // Prepare order details for email
      const orderDetails = {
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        customer_phone: order.customer_phone,
        shipping_address: order.shipping_address,
        total_amount: newTotal,
        order_items: newItems.map((item) => ({
          product_name: item.name,
          product_price: item.price,
          quantity: item.quantity,
          subtotal: item.price * item.quantity,
        })),
        order_date: order.created_at,
        user_id: order.user_id,
        order_id: order.id,
      }

      // Send modification emails
      await EmailService.sendOrderModification(orderDetails)

      await loadOrders()
      setIsModifyingOrder(false)
      setSelectedOrder(null)
      showMessage("Order modified successfully. Confirmation emails have been sent.")
    } catch (error) {
      console.error("Error modifying order:", error)
      showMessage("Failed to modify order. Please try again.", true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setContactError("")
    setIsContactSubmitting(true)

    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setContactError("Please fill in all required fields")
      setIsContactSubmitting(false)
      return
    }

    try {
      // Send contact message via email service
      await EmailService.sendContactMessage(contactForm)

      // Reset form
      setContactForm({ name: "", email: "", message: "" })
      showMessage("Your message has been sent successfully!", false)
    } catch (error) {
      setContactError("An error occurred. Please try again.")
    } finally {
      setIsContactSubmitting(false)
    }
  }

  const handleReturnRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!returnRequest.orderId || !returnRequest.reason || !returnRequest.items) {
      setOrderError("Please fill in all required fields")
      setIsSubmitting(false)
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Reset form
      setReturnRequest({ orderId: "", reason: "", items: "" })
      setReturnStatus("approved")
      showMessage("Your return request has been submitted!", false)
    } catch (error) {
      setOrderError("An error occurred. Please try again.")
      setReturnStatus("rejected")
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleFaq = (index: number) => {
    setFaqExpanded((prev) => (prev === index ? null : index))
  }

  const togglePolicy = (index: number) => {
    setPolicyExpanded((prev) => (prev === index ? null : index))
  }

  const pageVariants = {
    initial: { opacity: 0, y: 30, scale: 0.95 },
    in: { opacity: 1, y: 0, scale: 1 },
    out: { opacity: 0, y: -30, scale: 1.05 },
  }

  const pageTransition = {
    type: "spring",
    stiffness: 300,
    damping: 30,
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100">
        <motion.div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-emerald-600 font-medium"
          >
            Loading your natural hair care experience...
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Success/Error Notifications */}
      <AnimatePresence>
        {(successMessage || orderError) && (
          <motion.div
            className="fixed top-1/2 left-4 transform -translate-y-1/2 z-50 max-w-md"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <motion.div
              className={`p-4 rounded-2xl shadow-2xl backdrop-blur-lg border ${
                successMessage
                  ? "bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200"
                  : "bg-gradient-to-r from-red-50 to-pink-50 border-red-200"
              }`}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start space-x-3">
                {successMessage ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="p-2 bg-emerald-500 rounded-full">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </motion.div>
                ) : (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="p-2 bg-red-500 rounded-full">
                    <AlertCircle className="h-5 w-5 text-white" />
                  </motion.div>
                )}
                <div className="flex-1">
                  <p className={`font-medium ${successMessage ? "text-emerald-800" : "text-red-800"}`}>
                    {successMessage ? "Success!" : "Error"}
                  </p>
                  <p className={`text-sm ${successMessage ? "text-emerald-600" : "text-red-600"}`}>
                    {successMessage || orderError}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Background */}
      <div className="fixed inset-0 -z-10">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-green-50"
          animate={{
            background: [
              "linear-gradient(135deg, #ecfdf5 0%, #ffffff 25%, #f0fdf4 50%, #dcfce7 75%, #bbf7d0 100%)",
              "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 25%, #ffffff 50%, #f0fdf4 75%, #dcfce7 100%)",
              "linear-gradient(135deg, #ffffff 0%, #f0fdf4 25%, #ecfdf5 50%, #dcfce7 75%, #bbf7d0 100%)",
            ],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(52, 211, 153, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 50% 10%, rgba(34, 197, 94, 0.05) 0%, transparent 50%)`,
          }}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      </div>

      {/* Modern Header */}
      <motion.header
        className="sticky top-0 z-50"
        style={{
          backgroundColor: `rgba(255, 255, 255, ${headerOpacity})`,
          backdropFilter: `blur(${headerBlur}px)`,
          borderBottom: "1px solid rgba(16, 185, 129, 0.1)",
        }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="flex items-center space-x-4"
            >
              <motion.div
                className="relative flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigateToPage("products")}
                style={{ cursor: "pointer" }}
              >
                <motion.img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-25%20153324-QJsoQScO5touZXDswxzKaUYgsFNNLt.png"
                  alt="SPARSH by R Naturals - Premium Hair Care"
                  className="h-16 w-auto object-contain"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  onError={(e) => {
                    // Fallback to text logo if image fails to load
                    e.currentTarget.style.display = "none"
                    e.currentTarget.nextElementSibling.style.display = "flex"
                  }}
                />
                <div className="hidden items-center space-x-4">
                  <motion.div
                    className="relative w-14 h-14 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-xl"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Sparkles className="text-white w-7 h-7" />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{ x: [-100, 100] }}
                      transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
                    />
                  </motion.div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                      SPARSH
                    </h1>
                    <p className="text-xs text-gray-600 font-medium tracking-widest uppercase">Hair Care Experts</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant={currentPage === "products" ? "default" : "ghost"}
                  onClick={() => navigateToPage("products")}
                  className={`font-medium transition-all duration-300 rounded-xl px-6 ${
                    currentPage === "products"
                      ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg hover:shadow-xl"
                      : "text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50/80"
                  }`}
                >
                  Products
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  onClick={() => navigateToPage("cart")}
                  className="relative text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50/80 font-medium transition-all duration-300 rounded-xl px-6"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Cart
                  {getTotalItems() > 0 && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 -right-2">
                      <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg">
                        {getTotalItems()}
                      </div>
                    </motion.div>
                  )}
                </Button>
              </motion.div>

              {user ? (
                <div className="flex items-center space-x-2 ml-4">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      onClick={() => navigateToPage("orders")}
                      className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50/80 font-medium transition-all duration-300 rounded-xl"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Orders
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      onClick={() => navigateToPage("profile")}
                      className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50/80 font-medium transition-all duration-300 rounded-xl"
                    >
                      <UserCircle className="w-4 h-4 mr-2" />
                      Profile
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-medium transition-all duration-300 rounded-xl"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </motion.div>
                </div>
              ) : (
                <div className="flex items-center space-x-2 ml-4">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      onClick={() => navigateToPage("login")}
                      className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50/80 font-medium transition-all duration-300 rounded-xl"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Login
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => navigateToPage("signup")}
                      className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-medium transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl"
                    >
                      Sign Up
                    </Button>
                  </motion.div>
                </div>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-xl"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <motion.div animate={{ rotate: isMenuOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.div>
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-b border-emerald-100/30 shadow-lg"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {["products", "cart"].map((page) => (
                <motion.div key={page} whileHover={{ x: 10 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant={currentPage === page ? "default" : "ghost"}
                    onClick={() => navigateToPage(page as any)}
                    className={`w-full justify-start capitalize transition-all duration-300 rounded-xl ${
                      currentPage === page
                        ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white"
                        : "hover:bg-emerald-50"
                    }`}
                  >
                    {page === "cart" && <ShoppingCart className="w-5 h-5 mr-2" />}
                    {page} {page === "cart" && `(${getTotalItems()})`}
                  </Button>
                </motion.div>
              ))}
              {user ? (
                <>
                  {["orders", "profile"].map((page) => (
                    <motion.div key={page} whileHover={{ x: 10 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="ghost"
                        onClick={() => navigateToPage(page as any)}
                        className="w-full justify-start hover:bg-emerald-50 rounded-xl capitalize"
                      >
                        {page === "orders" ? (
                          <Package className="w-4 h-4 mr-2" />
                        ) : (
                          <UserCircle className="w-4 h-4 mr-2" />
                        )}
                        {page}
                      </Button>
                    </motion.div>
                  ))}
                  <motion.div whileHover={{ x: 10 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                      className="w-full justify-start hover:bg-emerald-50 rounded-xl"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </motion.div>
                </>
              ) : (
                <>
                  {["login", "signup"].map((page) => (
                    <motion.div key={page} whileHover={{ x: 10 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="ghost"
                        onClick={() => navigateToPage(page as any)}
                        className="w-full justify-start hover:bg-emerald-50 rounded-xl capitalize"
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        {page === "signup" ? "Sign Up" : "Login"}
                      </Button>
                    </motion.div>
                  ))}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {currentPage === "products" && (
            <motion.div
              key="products"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              {/* Hero Section */}
              <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-green-100 px-6 py-2 rounded-full mb-6 border border-emerald-200"
                >
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  <span className="text-emerald-700 font-medium">Premium Hair Care Collection</span>
                </motion.div>

                <h2 className="text-5xl md:text-7xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                    Transform Your Hair
                  </span>
                  <br />
                  <span className="text-gray-800">Naturally</span>
                </h2>

                <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
                  Discover our scientifically formulated hair care products crafted with premium natural ingredients.
                  From growth acceleration to damage repair, achieve salon-quality results at home.
                </p>

                {/* Trust Indicators */}
                <motion.div
                  className="flex items-center justify-center gap-8 flex-wrap"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {[
                    { icon: Shield, text: "Sulfate Free" },
                    { icon: Leaf, text: "100% Natural" },
                    { icon: Award, text: "Dermatologist Tested" },
                    { icon: Star, text: "Premium Quality" },
                  ].map((item, index) => (
                    <motion.div
                      key={item.text}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="flex items-center gap-2 text-emerald-600"
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.text}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Products Grid */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {products.map((product, index) => {
                  try {
                    return (
                      <motion.div
                        key={product.id}
                        variants={itemVariants}
                        whileHover={{ y: -10, scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      >
                        <Card className="group overflow-hidden border-0 shadow-xl bg-white/95 backdrop-blur-md hover:shadow-2xl transition-all duration-500 relative rounded-3xl">
                          <CardContent className="p-0">
                            {/* Product Image Container */}
                            <div className="relative overflow-hidden rounded-t-3xl">
                              <motion.img
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                className="w-full h-80 object-contain bg-gradient-to-br from-emerald-50 to-green-50 p-4"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.6 }}
                                onError={(e) => {
                                  e.currentTarget.src =
                                    "/placeholder.svg?height=320&width=320&text=" + encodeURIComponent(product.name)
                                }}
                              />

                              {/* Gradient Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                              {/* Wishlist Button */}
                              <motion.button
                                className="absolute top-4 right-4 p-3 bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-white/20"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => toggleWishlist(product.id)}
                              >
                                <Heart
                                  className={`w-5 h-5 transition-colors duration-300 ${
                                    wishlist.includes(product.id) ? "fill-red-500 text-red-500" : "text-gray-600"
                                  }`}
                                />
                              </motion.button>

                              {/* Hover Benefits */}
                              <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                                  <p className="text-xs font-medium text-gray-700 mb-2">Key Benefits:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {(product.benefits || []).slice(0, 2).map((benefit, benefitIndex) => (
                                      <span
                                        key={benefitIndex}
                                        className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium"
                                      >
                                        {benefit}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Product Details */}
                            <div className="p-6">
                              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors duration-300">
                                {product.name}
                              </h3>
                              <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-2">
                                {product.description}
                              </p>

                              {/* Benefits Tags */}
                              <div className="flex flex-wrap gap-2 mb-4">
                                {(product.benefits || []).slice(0, 3).map((benefit, benefitIndex) => (
                                  <span
                                    key={benefitIndex}
                                    className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg text-xs font-medium border border-emerald-100"
                                  >
                                    {benefit}
                                  </span>
                                ))}
                              </div>

                              {/* Price Section */}
                              <div className="flex items-center justify-center mb-4">
                                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                                  ₹{product.price.toLocaleString()}
                                </span>
                              </div>

                              {/* Quantity and Add to Cart */}
                              <div className="flex items-center gap-3">
                                {/* Modern Quantity Selector */}
                                <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                                  <motion.button
                                    type="button"
                                    onClick={() =>
                                      updateProductQuantity(product.id, (productQuantities[product.id] || 1) - 1)
                                    }
                                    className="p-2 hover:bg-gray-100 transition-colors duration-200 text-gray-600"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    disabled={productQuantities[product.id] <= 1}
                                  >
                                    <Minus className="w-4 h-4" />
                                  </motion.button>
                                  <input
                                    type="number"
                                    min="1"
                                    max="99"
                                    value={productQuantities[product.id] || 1}
                                    onChange={(e) => {
                                      const value = Number.parseInt(e.target.value) || 1
                                      updateProductQuantity(product.id, value)
                                    }}
                                    className="w-12 text-center bg-transparent border-0 text-gray-700 font-semibold focus:outline-none"
                                  />
                                  <motion.button
                                    type="button"
                                    onClick={() =>
                                      updateProductQuantity(product.id, (productQuantities[product.id] || 1) + 1)
                                    }
                                    className="p-2 hover:bg-gray-100 transition-colors duration-200 text-gray-600"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    disabled={productQuantities[product.id] >= 99}
                                  >
                                    <Plus className="w-4 h-4" />
                                  </motion.button>
                                </div>

                                {/* Enhanced Add to Cart Button */}
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                                  <Button
                                    onClick={() => addToCart(product)}
                                    className="w-full bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700 text-white shadow-lg transition-all duration-300 rounded-xl py-3 font-semibold"
                                  >
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    Add to Cart
                                  </Button>
                                </motion.div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  } catch (error) {
                    console.error("Error rendering product:", product, error)
                    return null
                  }
                })}
              </motion.div>
            </motion.div>
          )}

          {currentPage === "cart" && (
            <motion.div
              key="cart"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <div className="max-w-4xl mx-auto">
                <motion.h2
                  className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Your Hair Care Cart
                </motion.h2>

                {cart.length === 0 ? (
                  <motion.div
                    className="text-center py-16"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      className="w-32 h-32 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                      <ShoppingCart className="w-16 h-16 text-emerald-400" />
                    </motion.div>
                    <h3 className="text-2xl font-semibold text-gray-600 mb-4">Your cart is empty</h3>
                    <p className="text-gray-500 mb-8">
                      Discover our premium hair care products and start your journey to healthier hair
                    </p>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={() => navigateToPage("products")}
                        className="bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700 text-white shadow-lg px-8 py-3 rounded-xl"
                      >
                        Explore Products
                      </Button>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
                    {cart.map((item, index) => {
                      if (!item || !item.benefits) return null

                      return (
                        <motion.div
                          key={item.id}
                          variants={itemVariants}
                          layout
                          whileHover={{ scale: 1.01 }}
                          transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        >
                          <Card className="p-6 bg-white/95 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-100 rounded-2xl">
                            <div className="flex items-center space-x-6">
                              <motion.img
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                className="w-28 h-28 object-contain bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl shadow-md p-2"
                                whileHover={{ scale: 1.05 }}
                                onError={(e) => {
                                  e.currentTarget.src =
                                    "/placeholder.svg?height=112&width=112&text=" + encodeURIComponent(item.name)
                                }}
                              />
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                                    ₹{item.price.toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {(item.benefits || []).slice(0, 2).map((benefit, benefitIndex) => (
                                    <span
                                      key={benefitIndex}
                                      className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg text-xs font-medium"
                                    >
                                      {benefit}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="flex flex-col items-center space-y-4">
                                <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200">
                                  <motion.button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="p-2 hover:bg-gray-100 transition-colors duration-200 text-gray-600"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <Minus className="w-4 h-4" />
                                  </motion.button>
                                  <span className="w-12 text-center font-semibold text-gray-700">{item.quantity}</span>
                                  <motion.button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="p-2 hover:bg-gray-100 transition-colors duration-200 text-gray-600"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <Plus className="w-4 h-4" />
                                  </motion.button>
                                </div>
                                <div className="text-center">
                                  <p className="text-lg font-bold text-gray-800">
                                    ₹{(item.price * item.quantity).toLocaleString()}
                                  </p>
                                  <motion.button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-red-500 hover:text-red-700 mt-2"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      )
                    })}

                    {/* Enhanced Cart Summary */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Card className="p-8 bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 border-0 shadow-xl rounded-3xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div className="text-center">
                            <p className="text-sm text-gray-600 mb-2">Items</p>
                            <p className="text-2xl font-bold text-gray-800">{getTotalItems()}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600 mb-2">Total</p>
                            <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                              ₹{getTotalPrice().toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="border-t border-emerald-200 pt-6">
                          <div className="flex justify-between items-center mb-6">
                            <span className="text-2xl font-bold text-gray-800">Total:</span>
                            <span className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                              ₹{getTotalPrice().toLocaleString()}
                            </span>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-4">
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                              <Button
                                variant="outline"
                                onClick={clearCart}
                                className="w-full border-red-300 text-red-600 hover:bg-red-50 py-3 rounded-xl font-semibold"
                              >
                                Clear Cart
                              </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                              <Button
                                onClick={() => (user ? navigateToPage("checkout") : navigateToPage("login"))}
                                className="w-full bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700 text-white shadow-lg py-3 rounded-xl font-semibold"
                              >
                                {user ? "Proceed to Checkout" : "Login to Checkout"}
                              </Button>
                            </motion.div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {currentPage === "login" && (
            <motion.div
              key="login"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <div className="max-w-md mx-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="p-8 bg-white/95 backdrop-blur-md shadow-2xl border-0 relative overflow-hidden rounded-3xl">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500" />
                    <motion.h2
                      className="text-3xl font-bold text-center bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      Welcome Back
                    </motion.h2>

                    {!showForgotPassword ? (
                      <form onSubmit={handleLogin} className="space-y-6">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <Label htmlFor="email" className="text-gray-700 font-medium">
                            Email *
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={loginForm.email}
                            onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))}
                            className="mt-2 bg-white/80 backdrop-blur-sm border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl"
                            placeholder="Enter your email"
                            required
                          />
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <Label htmlFor="password" className="text-gray-700 font-medium">
                            Password *
                          </Label>
                          <div className="relative">
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              value={loginForm.password}
                              onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                              className="mt-2 pr-12 bg-white/80 backdrop-blur-sm border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl"
                              placeholder="Enter your password"
                              required
                            />
                            <motion.button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-emerald-600"
                              onClick={() => setShowPassword(!showPassword)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </motion.button>
                          </div>
                        </motion.div>

                        {authError && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-red-600 text-sm bg-red-50 p-4 rounded-xl border border-red-200"
                          >
                            <div className="flex items-center gap-2">
                              <AlertCircle className="w-4 h-4" />
                              <span>{authError}</span>
                            </div>
                            {authError.includes("Invalid email or password") && (
                              <div className="mt-2 text-xs text-red-500">
                                Please check your email and password. If you forgot your password, use the "Forgot
                                Password" link below.
                              </div>
                            )}
                          </motion.div>
                        )}

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700 text-white shadow-lg py-3 rounded-xl font-semibold"
                          >
                            {isSubmitting ? (
                              <div className="flex items-center justify-center">
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                                />
                                Signing in...
                              </div>
                            ) : (
                              "Login"
                            )}
                          </Button>
                        </motion.div>

                        <motion.div
                          className="text-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.7 }}
                        >
                          <button
                            type="button"
                            onClick={() => setShowForgotPassword(true)}
                            className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                          >
                            Forgot your password?
                          </button>
                        </motion.div>
                      </form>
                    ) : (
                      <form onSubmit={handleForgotPassword} className="space-y-6">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <Label htmlFor="reset-email" className="text-gray-700 font-medium">
                            Email Address *
                          </Label>
                          <Input
                            id="reset-email"
                            type="email"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            className="mt-2 bg-white/80 backdrop-blur-sm border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl"
                            placeholder="Enter your email to reset password"
                            required
                          />
                        </motion.div>

                        {authError && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-red-600 text-sm bg-red-50 p-4 rounded-xl border border-red-200"
                          >
                            <div className="flex items-center gap-2">
                              <AlertCircle className="w-4 h-4" />
                              <span>{authError}</span>
                            </div>
                          </motion.div>
                        )}

                        {resetEmailSent && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-emerald-600 text-sm bg-emerald-50 p-4 rounded-xl border border-emerald-200"
                          >
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4" />
                              <span>Password reset email sent! Please check your inbox.</span>
                            </div>
                          </motion.div>
                        )}

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700 text-white shadow-lg py-3 rounded-xl font-semibold"
                          >
                            {isSubmitting ? (
                              <div className="flex items-center justify-center">
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                                />
                                Sending...
                              </div>
                            ) : (
                              "Send Reset Email"
                            )}
                          </Button>
                        </motion.div>

                        <motion.div
                          className="text-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.7 }}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setShowForgotPassword(false)
                              setResetEmail("")
                              setResetEmailSent(false)
                              setAuthError("")
                            }}
                            className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                          >
                            Back to Login
                          </button>
                        </motion.div>
                      </form>
                    )}

                    <motion.div
                      className="mt-8 text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <p className="text-gray-600">
                        Don't have an account?{" "}
                        <button
                          onClick={() => navigateToPage("signup")}
                          className="text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                          Sign up here
                        </button>
                      </p>
                    </motion.div>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          )}

          {currentPage === "signup" && (
            <motion.div
              key="signup"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <div className="max-w-md mx-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="p-8 bg-white/95 backdrop-blur-md shadow-2xl border-0 relative overflow-hidden rounded-3xl">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500" />
                    <motion.h2
                      className="text-3xl font-bold text-center bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      Join SPARSH
                    </motion.h2>

                    <form onSubmit={handleSignup} className="space-y-6">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Label htmlFor="name" className="text-gray-700 font-medium">
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          value={signupForm.name}
                          onChange={(e) => setSignupForm((prev) => ({ ...prev, name: e.target.value }))}
                          className="mt-2 bg-white/80 backdrop-blur-sm border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl"
                          placeholder="Enter your full name"
                          required
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Label htmlFor="signup-email" className="text-gray-700 font-medium">
                          Email *
                        </Label>
                        <Input
                          id="signup-email"
                          type="email"
                          value={signupForm.email}
                          onChange={(e) => setSignupForm((prev) => ({ ...prev, email: e.target.value }))}
                          className="mt-2 bg-white/80 backdrop-blur-sm border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl"
                          placeholder="Enter your email"
                          required
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <Label htmlFor="signup-password" className="text-gray-700 font-medium">
                          Password *
                        </Label>
                        <div className="relative">
                          <Input
                            id="signup-password"
                            type={showPassword ? "text" : "password"}
                            value={signupForm.password}
                            onChange={(e) => setSignupForm((prev) => ({ ...prev, password: e.target.value }))}
                            className="mt-2 pr-12 bg-white/80 backdrop-blur-sm border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl"
                            placeholder="Create a password (min 6 characters)"
                            required
                          />
                          <motion.button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-emerald-600"
                            onClick={() => setShowPassword(!showPassword)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </motion.button>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        <Label htmlFor="confirm-password" className="text-gray-700 font-medium">
                          Confirm Password *
                        </Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={signupForm.confirmPassword}
                          onChange={(e) => setSignupForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                          className="mt-2 bg-white/80 backdrop-blur-sm border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl"
                          placeholder="Confirm your password"
                          required
                        />
                      </motion.div>

                      {authError && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-red-600 text-sm bg-red-50 p-4 rounded-xl border border-red-200"
                        >
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            <span>{authError}</span>
                          </div>
                        </motion.div>
                      )}

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700 text-white shadow-lg py-3 rounded-xl font-semibold"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center justify-center">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                              />
                              Creating account...
                            </div>
                          ) : (
                            "Create Account"
                          )}
                        </Button>
                      </motion.div>
                    </form>

                    <motion.div
                      className="mt-8 text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 }}
                    >
                      <p className="text-gray-600">
                        Already have an account?{" "}
                        <button
                          onClick={() => navigateToPage("login")}
                          className="text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                          Login here
                        </button>
                      </p>
                    </motion.div>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Continue with other pages... */}
          {currentPage === "checkout" && (
            <motion.div
              key="checkout"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <div className="max-w-2xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="p-8 bg-white/95 backdrop-blur-md shadow-2xl border-0 relative overflow-hidden rounded-3xl">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500" />
                    <motion.h2
                      className="text-3xl font-bold text-center bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      Complete Your Hair Care Order
                    </motion.h2>

                    {orderError && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-6"
                      >
                        <Alert className="border-red-200 bg-red-50 rounded-xl">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <AlertDescription className="text-red-800">{orderError}</AlertDescription>
                        </Alert>
                      </motion.div>
                    )}

                    <form onSubmit={handleCheckout} className="space-y-6">
                      <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <div>
                          <Label htmlFor="checkout-name" className="text-gray-700 font-medium">
                            Full Name *
                          </Label>
                          <Input
                            id="checkout-name"
                            name="name"
                            type="text"
                            value={checkoutForm.name}
                            onChange={(e) => setCheckoutForm((prev) => ({ ...prev, name: e.target.value }))}
                            className="mt-2 bg-white/80 backdrop-blur-sm border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="checkout-email" className="text-gray-700 font-medium">
                            Email *
                          </Label>
                          <Input
                            id="checkout-email"
                            name="email"
                            type="email"
                            value={checkoutForm.email}
                            onChange={(e) => setCheckoutForm((prev) => ({ ...prev, email: e.target.value }))}
                            className="mt-2 bg-white/80 backdrop-blur-sm border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl"
                            required
                          />
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Label htmlFor="checkout-phone" className="text-gray-700 font-medium">
                          Phone Number *
                        </Label>
                        <Input
                          id="checkout-phone"
                          name="phone"
                          type="tel"
                          value={checkoutForm.phone}
                          onChange={(e) => setCheckoutForm((prev) => ({ ...prev, phone: e.target.value }))}
                          className="mt-2 bg-white/80 backdrop-blur-sm border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl"
                          required
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <Label htmlFor="checkout-address" className="text-gray-700 font-medium">
                          Delivery Address *
                        </Label>
                        <Textarea
                          id="checkout-address"
                          name="address"
                          value={checkoutForm.address}
                          onChange={(e) => setCheckoutForm((prev) => ({ ...prev, address: e.target.value }))}
                          className="mt-2 bg-white/80 backdrop-blur-sm border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl"
                          rows={3}
                          required
                        />
                      </motion.div>

                      <motion.div
                        className="bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 p-6 rounded-2xl border border-emerald-200"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        <h3 className="font-bold text-gray-800 mb-4 text-lg flex items-center">
                          <Sparkles className="w-5 h-5 text-emerald-500 mr-2" />
                          Order Summary
                        </h3>
                        <div className="space-y-3 text-sm">
                          {cart.map((item) => (
                            <motion.div
                              key={item.id}
                              className="flex justify-between items-center py-2 border-b border-emerald-100 last:border-b-0"
                            >
                              <div>
                                <span className="font-medium">
                                  {item.name} x {item.quantity}
                                </span>
                              </div>
                              <span className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</span>
                            </motion.div>
                          ))}

                          <motion.div
                            className="border-t border-emerald-300 pt-3 font-bold flex justify-between text-lg"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.0 }}
                          >
                            <span>Total:</span>
                            <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                              ₹{getTotalPrice().toLocaleString()}
                            </span>
                          </motion.div>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700 text-white shadow-lg py-4 text-lg font-semibold rounded-xl"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center justify-center">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mr-2"
                              />
                              Processing...
                            </div>
                          ) : (
                            "Place Order"
                          )}
                        </Button>
                      </motion.div>
                    </form>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          )}

          {currentPage === "profile" && (
            <motion.div
              key="profile"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <div className="max-w-2xl mx-auto">
                <motion.h2
                  className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  My Profile
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="p-8 bg-white/95 backdrop-blur-md shadow-2xl border-0 rounded-3xl">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-6">
                          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <User className="w-10 h-10 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-800">{profile?.full_name || user?.email}</h3>
                            <p className="text-gray-600">{profile?.email || user?.email}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                              <span className="text-sm text-gray-600">Premium Hair Care Member</span>
                            </div>
                          </div>
                        </div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            onClick={() => setIsEditingProfile(!isEditingProfile)}
                            variant="outline"
                            className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-xl"
                          >
                            {isEditingProfile ? (
                              <XCircle className="w-4 h-4 mr-2" />
                            ) : (
                              <Edit className="w-4 h-4 mr-2" />
                            )}
                            {isEditingProfile ? "Cancel" : "Edit Profile"}
                          </Button>
                        </motion.div>
                      </div>

                      {isEditingProfile ? (
                        <form onSubmit={handleProfileEdit} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <Label className="text-gray-700 font-medium">Full Name</Label>
                              <Input
                                value={editProfileForm.name}
                                onChange={(e) => setEditProfileForm((prev) => ({ ...prev, name: e.target.value }))}
                                className="mt-2 bg-white/80 backdrop-blur-sm border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl"
                                placeholder="Enter your full name"
                              />
                            </div>
                            <div>
                              <Label className="text-gray-700 font-medium">Phone</Label>
                              <Input
                                value={editProfileForm.phone}
                                onChange={(e) => setEditProfileForm((prev) => ({ ...prev, phone: e.target.value }))}
                                className="mt-2 bg-white/80 backdrop-blur-sm border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl"
                                placeholder="Enter your phone number"
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="text-gray-700 font-medium">Address</Label>
                            <Textarea
                              value={editProfileForm.address}
                              onChange={(e) => setEditProfileForm((prev) => ({ ...prev, address: e.target.value }))}
                              className="mt-2 bg-white/80 backdrop-blur-sm border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl"
                              placeholder="Enter your address"
                              rows={3}
                            />
                          </div>
                          <div className="flex gap-4">
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                              <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl py-3"
                              >
                                <Save className="w-4 h-4 mr-2" />
                                {isSubmitting ? "Saving..." : "Save Changes"}
                              </Button>
                            </motion.div>
                          </div>
                        </form>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <Label className="text-gray-700 font-medium">Full Name</Label>
                            <div className="mt-2 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                              {profile?.full_name || "Not provided"}
                            </div>
                          </div>
                          <div>
                            <Label className="text-gray-700 font-medium">Email</Label>
                            <div className="mt-2 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                              {profile?.email || user?.email}
                            </div>
                          </div>
                          <div>
                            <Label className="text-gray-700 font-medium">Phone</Label>
                            <div className="mt-2 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                              {profile?.phone || "Not provided"}
                            </div>
                          </div>
                          <div>
                            <Label className="text-gray-700 font-medium">Address</Label>
                            <div className="mt-2 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                              {profile?.address || "Not provided"}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        <Button
                          onClick={() => navigateToPage("orders")}
                          className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl py-3"
                        >
                          <Package className="w-4 h-4 mr-2" />
                          View Orders
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleLogout}
                          className="border-red-300 text-red-600 hover:bg-red-50 rounded-xl py-3"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          )}

          {currentPage === "orders" && (
            <motion.div
              key="orders"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <div className="max-w-4xl mx-auto">
                <motion.h2
                  className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  My Hair Care Orders
                </motion.h2>

                {orders.length === 0 ? (
                  <motion.div
                    className="text-center py-16"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="w-32 h-32 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Package className="w-16 h-16 text-emerald-400" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-600 mb-4">No orders yet</h3>
                    <p className="text-gray-500 mb-8">Start your hair care journey with our premium products</p>
                    <Button
                      onClick={() => navigateToPage("products")}
                      className="bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700 text-white shadow-lg px-8 py-3 rounded-xl"
                    >
                      Explore Products
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
                    {orders.map((order) => (
                      <motion.div key={order.id} variants={itemVariants}>
                        <Card className="p-6 bg-white/95 backdrop-blur-md shadow-lg border border-emerald-100 rounded-2xl hover:shadow-xl transition-all duration-300">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-bold text-gray-800">Order #{order.id.slice(0, 8)}</h3>
                              <p className="text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                className={`rounded-full px-3 py-1 ${
                                  order.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : order.status === "confirmed"
                                      ? "bg-blue-100 text-blue-800"
                                      : order.status === "shipped"
                                        ? "bg-purple-100 text-purple-800"
                                        : order.status === "delivered"
                                          ? "bg-green-100 text-green-800"
                                          : "bg-red-100 text-red-800"
                                }`}
                              >
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                            </div>
                          </div>

                          <div className="space-y-2 mb-4">
                            {order.order_items?.map((item: OrderItem) => (
                              <div
                                key={item.id}
                                className="flex justify-between items-center py-2 border-b border-emerald-100 last:border-b-0"
                              >
                                <span className="font-medium">
                                  {item.product_name} x {item.quantity}
                                </span>
                                <span className="font-semibold">
                                  ₹{(item.product_price * item.quantity).toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-between items-center pt-4 border-t border-emerald-200 mb-4">
                            <span className="text-lg font-bold text-gray-800">Total:</span>
                            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                              ₹{order.total_amount.toLocaleString()}
                            </span>
                          </div>

                          {/* Order Actions */}
                          {order.status !== "cancelled" && order.status !== "delivered" && (
                            <div className="flex gap-3">
                              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                                <Button
                                  onClick={() => {
                                    setSelectedOrder(order)
                                    setIsModifyingOrder(true)
                                    // Convert order items to cart format
                                    const orderCart =
                                      order.order_items?.map((item) => {
                                        const product = products.find((p) => p.id === item.product_id)
                                        return {
                                          ...product!,
                                          quantity: item.quantity,
                                        }
                                      }) || []
                                    setCart(orderCart)
                                  }}
                                  variant="outline"
                                  className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-xl"
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Modify Order
                                </Button>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                                <Button
                                  onClick={() => handleCancelOrder(order)}
                                  disabled={isSubmitting}
                                  variant="outline"
                                  className="w-full border-red-300 text-red-600 hover:bg-red-50 rounded-xl"
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  {isSubmitting ? "Cancelling..." : "Cancel Order"}
                                </Button>
                              </motion.div>
                            </div>
                          )}
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Order Modification Modal */}
                <AnimatePresence>
                  {isModifyingOrder && selectedOrder && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    >
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 50 }}
                        className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
                      >
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                            Modify Order #{selectedOrder.id.slice(0, 8)}
                          </h3>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setIsModifyingOrder(false)
                              setSelectedOrder(null)
                              setCart([])
                            }}
                            className="rounded-xl"
                          >
                            <X className="w-6 h-6" />
                          </Button>
                        </div>

                        <div className="space-y-4 mb-6">
                          {cart.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl"
                            >
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-800">{item.name}</h4>
                                <p className="text-sm text-gray-600">₹{item.price.toLocaleString()}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center bg-white rounded-xl border border-gray-200">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="h-8 w-8 rounded-xl"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </Button>
                                  <span className="w-12 text-center font-medium">{item.quantity}</span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="h-8 w-8 rounded-xl"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </Button>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="border-t pt-4 mb-6">
                          <div className="flex justify-between items-center text-lg font-bold">
                            <span>New Total:</span>
                            <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                              ₹{getTotalPrice().toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsModifyingOrder(false)
                              setSelectedOrder(null)
                              setCart([])
                            }}
                            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => handleModifyOrder(selectedOrder, cart)}
                            disabled={isSubmitting || cart.length === 0}
                            className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl"
                          >
                            {isSubmitting ? "Updating..." : "Update Order"}
                          </Button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {currentPage === "contact" && (
            <motion.div
              key="contact"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <div className="max-w-4xl mx-auto">
                <motion.h2
                  className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Contact Us
                </motion.h2>

                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, staggerChildren: 0.1 }}
                >
                  {/* Contact Form */}
                  <motion.div variants={itemVariants}>
                    <Card className="p-6 bg-white/95 backdrop-blur-md shadow-lg border border-emerald-100 rounded-2xl">
                      <CardContent>
                        <form onSubmit={handleContactSubmit} className="space-y-4">
                          {contactError && (
                            <Alert variant="destructive">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>{contactError}</AlertDescription>
                            </Alert>
                          )}
                          <div>
                            <Label htmlFor="contact-name">Name</Label>
                            <Input
                              id="contact-name"
                              type="text"
                              value={contactForm.name}
                              onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                              className="bg-white/80 backdrop-blur-sm border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="contact-email">Email</Label>
                            <Input
                              id="contact-email"
                              type="email"
                              value={contactForm.email}
                              onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                              className="bg-white/80 backdrop-blur-sm border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="contact-message">Message</Label>
                            <Textarea
                              id="contact-message"
                              value={contactForm.message}
                              onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                              className="bg-white/80 backdrop-blur-sm border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl"
                              rows={4}
                              required
                            />
                          </div>
                          <Button
                            type="submit"
                            disabled={isContactSubmitting}
                            className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl"
                          >
                            {isContactSubmitting ? (
                              <div className="flex items-center justify-center">
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                  className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mr-2"
                                />
                                Sending...
                              </div>
                            ) : (
                              "Send Message"
                            )}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Contact Information */}
                  <motion.div variants={itemVariants} className="space-y-6">
                    <Card className="p-6 bg-white/95 backdrop-blur-md shadow-lg border border-emerald-100 rounded-2xl hover:scale-105 transition-transform duration-300">
                      <CardContent className="flex items-center space-x-4">
                        <Phone className="w-6 h-6 text-emerald-500" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">Phone</h3>
                          <p className="text-gray-600">+91 9409073136</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="p-6 bg-white/95 backdrop-blur-md shadow-lg border border-emerald-100 rounded-2xl hover:scale-105 transition-transform duration-300">
                      <CardContent className="flex items-center space-x-4">
                        <Mail className="w-6 h-6 text-emerald-500" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">Email</h3>
                          <p className="text-gray-600">info.sparsh@gmail.com</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="p-6 bg-white/95 backdrop-blur-md shadow-lg border border-emerald-100 rounded-2xl hover:scale-105 transition-transform duration-300">
                      <CardContent className="flex items-center space-x-4">
                        <MapPin className="w-6 h-6 text-emerald-500" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">Address</h3>
                          <p className="text-gray-600">Bhavnagar, Gujarat</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Map Placeholder */}
                    <motion.div
                      className="relative h-48 bg-gray-100 rounded-2xl overflow-hidden"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full"
                        />
                      </div>
                      <p className="absolute inset-0 flex items-center justify-center text-gray-500 font-medium">
                        Map Loading...
                      </p>
                    </motion.div>

                    {/* Social Links */}
                    <div className="flex space-x-4">
                      <motion.a
                        href="#"
                        className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg hover:scale-110 transition-transform duration-300"
                        whileTap={{ scale: 0.9 }}
                      >
                        <Facebook className="w-6 h-6" />
                      </motion.a>
                      <motion.a
                        href="#"
                        className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg hover:scale-110 transition-transform duration-300"
                        whileTap={{ scale: 0.9 }}
                      >
                        <Instagram className="w-6 h-6" />
                      </motion.a>
                      <motion.a
                        href="#"
                        className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg hover:scale-110 transition-transform duration-300"
                        whileTap={{ scale: 0.9 }}
                      >
                        <Twitter className="w-6 h-6" />
                      </motion.a>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {currentPage === "returns" && (
            <motion.div
              key="returns"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <div className="max-w-4xl mx-auto">
                <motion.h2
                  className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Returns & Exchanges
                </motion.h2>

                {/* Return Policy Sections */}
                <motion.div
                  className="space-y-6 mb-8"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, staggerChildren: 0.1 }}
                >
                  <motion.div variants={itemVariants}>
                    <Card className="bg-white/95 backdrop-blur-md shadow-lg border border-emerald-100 rounded-2xl">
                      <div className="p-6 flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-gray-800">Eligibility</h3>
                        <Button variant="ghost" size="icon" onClick={() => togglePolicy(1)}>
                          {policyExpanded === 1 ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </Button>
                      </div>
                      <AnimatePresence>
                        {policyExpanded === 1 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-6 pt-0"
                          >
                            <p className="text-gray-600">
                              To be eligible for a return, items must be unused, in their original packaging, and
                              returned within 30 days of purchase.
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Card className="bg-white/95 backdrop-blur-md shadow-lg border border-emerald-100 rounded-2xl">
                      <div className="p-6 flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-gray-800">Process</h3>
                        <Button variant="ghost" size="icon" onClick={() => togglePolicy(2)}>
                          {policyExpanded === 2 ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </Button>
                      </div>
                      <AnimatePresence>
                        {policyExpanded === 2 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-6 pt-0"
                          >
                            <p className="text-gray-600">
                              To initiate a return, please fill out the return request form below. Once approved, you
                              will receive instructions on how to return your item.
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Card className="bg-white/95 backdrop-blur-md shadow-lg border border-emerald-100 rounded-2xl">
                      <div className="p-6 flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-gray-800">Refunds</h3>
                        <Button variant="ghost" size="icon" onClick={() => togglePolicy(3)}>
                          {policyExpanded === 3 ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </Button>
                      </div>
                      <AnimatePresence>
                        {policyExpanded === 3 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-6 pt-0"
                          >
                            <p className="text-gray-600">
                              Refunds will be processed within 7-10 business days after we receive your returned item.
                              Refunds will be issued to the original payment method.
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                </motion.div>

                {/* Return Request Form */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <Card className="bg-white/95 backdrop-blur-md shadow-lg border border-emerald-100 rounded-2xl">
                    <CardContent className="p-6">
                      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Request a Return</h3>
                      <form onSubmit={handleReturnRequest} className="space-y-4">
                        {orderError && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{orderError}</AlertDescription>
                          </Alert>
                        )}
                        <div>
                          <Label htmlFor="return-order-id">Order ID</Label>
                          <Input
                            id="return-order-id"
                            type="text"
                            value={returnRequest.orderId}
                            onChange={(e) => setReturnRequest({ ...returnRequest, orderId: e.target.value })}
                            className="bg-white/80 backdrop-blur-sm border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="return-reason">Reason for Return</Label>
                          <Textarea
                            id="return-reason"
                            value={returnRequest.reason}
                            onChange={(e) => setReturnRequest({ ...returnRequest, reason: e.target.value })}
                            className="bg-white/80 backdrop-blur-sm border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl"
                            rows={3}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="return-items">Items to Return</Label>
                          <Textarea
                            id="return-items"
                            value={returnRequest.items}
                            onChange={(e) => setReturnRequest({ ...returnRequest, items: e.target.value })}
                            className="bg-white/80 backdrop-blur-sm border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl"
                            rows={3}
                            required
                          />
                        </div>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center justify-center">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mr-2"
                              />
                              Submitting...
                            </div>
                          ) : (
                            "Submit Request"
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>

                <br />

                {/* FAQ Section */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                  <Card className="bg-white/95 backdrop-blur-md shadow-lg border border-emerald-100 rounded-2xl">
                    <CardContent className="p-6">
                      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Frequently Asked Questions</h3>
                      <div className="space-y-4">
                        {/* FAQ Item 1 */}
                        <div className="border-b border-emerald-100 pb-4 last:border-b-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-lg font-medium text-gray-700">How long do I have to return an item?</h4>
                            <Button variant="ghost" size="icon" onClick={() => toggleFaq(1)}>
                              {faqExpanded === 1 ? (
                                <ChevronUp className="w-5 h-5" />
                              ) : (
                                <ChevronDown className="w-5 h-5" />
                              )}
                            </Button>
                          </div>
                          <AnimatePresence>
                            {faqExpanded === 1 && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-2 text-gray-600"
                              >
                                You have 30 days from the date of purchase to return an item.
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* FAQ Item 2 */}
                        <div className="border-b border-emerald-100 pb-4 last:border-b-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-lg font-medium text-gray-700">
                              What condition does the item need to be in to return it?
                            </h4>
                            <Button variant="ghost" size="icon" onClick={() => toggleFaq(2)}>
                              {faqExpanded === 2 ? (
                                <ChevronUp className="w-5 h-5" />
                              ) : (
                                <ChevronDown className="w-5 h-5" />
                              )}
                            </Button>
                          </div>
                          <AnimatePresence>
                            {faqExpanded === 2 && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-2 text-gray-600"
                              >
                                Items must be unused, in their original packaging, and in resalable condition.
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* FAQ Item 3 */}
                        <div className="border-b border-emerald-100 pb-4 last:border-b-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-lg font-medium text-gray-700">
                              How long does it take to process a refund?
                            </h4>
                            <Button variant="ghost" size="icon" onClick={() => toggleFaq(3)}>
                              {faqExpanded === 3 ? (
                                <ChevronUp className="w-5 h-5" />
                              ) : (
                                <ChevronDown className="w-5 h-5" />
                              )}
                            </Button>
                          </div>
                          <AnimatePresence>
                            {faqExpanded === 3 && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-2 text-gray-600"
                              >
                                Refunds will be processed within 7-10 business days after we receive your returned item.
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          )}
          {currentPage === "terms" && (
            <motion.div
              key="terms"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <div className="max-w-4xl mx-auto">
                <motion.h2
                  className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Terms & Conditions
                </motion.h2>

                <motion.div
                  className="space-y-8"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, staggerChildren: 0.1 }}
                >
                  {/* Terms sections */}
                  {[
                    {
                      title: "1. Acceptance of Terms",
                      content:
                        "By accessing and using the SPARSH by R Naturals website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.",
                    },
                    {
                      title: "2. Use License",
                      content:
                        "Permission is granted to temporarily download one copy of the materials on SPARSH's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not: modify or copy the materials; use the materials for any commercial purpose or for any public display; attempt to reverse engineer any software contained on the website; or remove any copyright or other proprietary notations from the materials.",
                    },
                    {
                      title: "3. Disclaimer",
                      content:
                        "The materials on SPARSH's website are provided on an 'as is' basis. SPARSH makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.",
                    },
                    {
                      title: "4. Limitations",
                      content:
                        "In no event shall SPARSH or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on SPARSH's website, even if SPARSH or an authorized representative has been notified orally or in writing of the possibility of such damage.",
                    },
                    {
                      title: "5. Privacy Policy",
                      content:
                        "Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our service. By using our service, you agree to the collection and use of information in accordance with our Privacy Policy.",
                    },
                    {
                      title: "6. Product Information",
                      content:
                        "We strive to provide accurate product information, including ingredients, benefits, and usage instructions. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free. All products are subject to availability.",
                    },
                    {
                      title: "7. Pricing and Payment",
                      content:
                        "All prices are listed in Indian Rupees (INR) and are subject to change without notice. Payment must be received in full before products are shipped. We accept various payment methods as indicated on our website.",
                    },
                    {
                      title: "8. Shipping and Delivery",
                      content:
                        "We will make every effort to deliver products within the estimated timeframe. However, delivery times are estimates and not guaranteed. Risk of loss and title for products pass to you upon delivery to the carrier.",
                    },
                    {
                      title: "9. User Accounts",
                      content:
                        "When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account.",
                    },
                    {
                      title: "10. Prohibited Uses",
                      content:
                        "You may not use our service: for any unlawful purpose or to solicit others to perform unlawful acts; to violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances; to infringe upon or violate our intellectual property rights or the intellectual property rights of others; to harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate; to submit false or misleading information.",
                    },
                    {
                      title: "11. Termination",
                      content:
                        "We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.",
                    },
                    {
                      title: "12. Governing Law",
                      content:
                        "These Terms shall be interpreted and governed by the laws of India. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts of Gujarat, India.",
                    },
                    {
                      title: "13. Changes to Terms",
                      content:
                        "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.",
                    },
                    {
                      title: "14. Contact Information",
                      content:
                        "If you have any questions about these Terms & Conditions, please contact us at rs.sparshnaturals@gmail.com or call us at +91 9409073136.",
                    },
                  ].map((section, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="bg-white/95 backdrop-blur-md shadow-lg border border-emerald-100 rounded-2xl p-6"
                    >
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">{section.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{section.content}</p>
                    </motion.div>
                  ))}

                  <motion.div
                    variants={itemVariants}
                    className="bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 border border-emerald-200 rounded-2xl p-6 text-center"
                  >
                    <p className="text-gray-700 font-medium">Last updated: January 2025</p>
                    <p className="text-gray-600 mt-2">
                      For any questions regarding these terms, please contact us at{" "}
                      <Button
                        variant="link"
                        onClick={() => navigateToPage("contact")}
                        className="text-emerald-600 hover:text-emerald-700 p-0"
                      >
                        rs.sparshnaturals@gmail.com
                      </Button>
                    </p>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {currentPage === "privacy" && (
            <motion.div
              key="privacy"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <div className="max-w-4xl mx-auto">
                <motion.h2
                  className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Privacy Policy
                </motion.h2>

                <motion.div
                  className="space-y-8"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, staggerChildren: 0.1 }}
                >
                  {/* Privacy sections */}
                  {[
                    {
                      title: "1. Information We Collect",
                      content:
                        "We collect information you provide directly to us, such as when you create an account, make a purchase, subscribe to our newsletter, or contact us. This may include your name, email address, phone number, shipping address, payment information, and any other information you choose to provide.",
                    },
                    {
                      title: "2. How We Use Your Information",
                      content:
                        "We use the information we collect to: provide, maintain, and improve our services; process transactions and send related information; send you technical notices, updates, security alerts, and support messages; respond to your comments, questions, and customer service requests; communicate with you about products, services, offers, and events; monitor and analyze trends, usage, and activities in connection with our services.",
                    },
                    {
                      title: "3. Information Sharing and Disclosure",
                      content:
                        "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share your information with: service providers who assist us in operating our website and conducting our business; when required by law or to protect our rights; in connection with a business transfer or acquisition.",
                    },
                    {
                      title: "4. Data Security",
                      content:
                        "We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.",
                    },
                    {
                      title: "5. Cookies and Tracking Technologies",
                      content:
                        "We use cookies and similar tracking technologies to collect and use personal information about you. Cookies are small data files stored on your device that help us improve our services and your experience. You can control cookies through your browser settings.",
                    },
                    {
                      title: "6. Third-Party Services",
                      content:
                        "Our website may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to read their privacy policies before providing any information.",
                    },
                    {
                      title: "7. Data Retention",
                      content:
                        "We retain your personal information for as long as necessary to fulfill the purposes outlined in this privacy policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.",
                    },
                    {
                      title: "8. Your Rights and Choices",
                      content:
                        "You have the right to: access, update, or delete your personal information; opt out of receiving promotional communications; request that we limit our use of your information; withdraw your consent where we rely on consent to process your information.",
                    },
                    {
                      title: "9. Children's Privacy",
                      content:
                        "Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.",
                    },
                    {
                      title: "10. International Data Transfers",
                      content:
                        "Your information may be transferred to and processed in countries other than your own. We will ensure that any such transfers comply with applicable data protection laws and that your information receives adequate protection.",
                    },
                    {
                      title: "11. Changes to This Privacy Policy",
                      content:
                        "We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the 'Last updated' date. We encourage you to review this policy periodically.",
                    },
                    {
                      title: "12. Contact Us",
                      content:
                        "If you have any questions about this privacy policy or our privacy practices, please contact us at rs.sparshnaturals@gmail.com or call us at +91 9409073136. You can also write to us at our address in Bhavnagar, Gujarat.",
                    },
                  ].map((section, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="bg-white/95 backdrop-blur-md shadow-lg border border-emerald-100 rounded-2xl p-6"
                    >
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">{section.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{section.content}</p>
                    </motion.div>
                  ))}

                  <motion.div
                    variants={itemVariants}
                    className="bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 border border-emerald-200 rounded-2xl p-6 text-center"
                  >
                    <p className="text-gray-700 font-medium">Last updated: January 2025</p>
                    <p className="text-gray-600 mt-2">
                      For privacy-related inquiries, please contact us at{" "}
                      <Button
                        variant="link"
                        onClick={() => navigateToPage("contact")}
                        className="text-emerald-600 hover:text-emerald-700 p-0"
                      >
                        rs.sparshnaturals@gmail.com
                      </Button>
                    </p>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-emerald-900 to-gray-900 text-white py-20 mt-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/40 to-green-900/40" />
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              "radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, rgba(52, 211, 153, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.3) 0%, transparent 50%)",
            ],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <div className="container mx-auto px-4 relative">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-5 gap-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, staggerChildren: 0.1 }}
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants}>
              <div className="flex items-center space-x-4 mb-6">
                <motion.img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-25%20153324-QJsoQScO5touZXDswxzKaUYgsFNNLt.png"
                  alt="SPARSH by R Naturals - Premium Hair Care"
                  className="h-12 w-auto object-contain brightness-0 invert"
                  whileHover={{ scale: 1.05 }}
                  onError={(e) => {
                    // Fallback to text logo if image fails to load
                    e.currentTarget.style.display = "none"
                    e.currentTarget.nextElementSibling.style.display = "flex"
                  }}
                />
                <div className="hidden items-center space-x-4">
                  <motion.div
                    className="w-14 h-14 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-xl"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Sparkles className="text-white w-7 h-7" />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                      SPARSH
                    </h3>
                    <p className="text-xs text-gray-400 font-medium tracking-widest uppercase">Hair Care Experts</p>
                  </div>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed mb-4">
                Transform your hair with our scientifically formulated products crafted with premium natural
                ingredients. Your journey to healthier, more beautiful hair starts here.
              </p>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 text-sm">Premium Hair Care Since 2024</span>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h4 className="text-lg font-semibold mb-6 text-white">Hair Solutions</h4>
              <ul className="space-y-3">
                {["Hair Growth", "Damage Repair", "Scalp Care", "Styling Products"].map((link) => (
                  <motion.li key={link} whileHover={{ x: 5 }}>
                    <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors duration-300">
                      {link}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h4 className="text-lg font-semibold mb-6 text-white">Customer Care</h4>
              <ul className="space-y-3">
                {[
                  { name: "Contact Us", page: "contact" },
                  { name: "Hair Consultation", page: null },
                  { name: "Hair Care Guide", page: null },
                ].map((link) => (
                  <motion.li key={link.name} whileHover={{ x: 5 }}>
                    {link.page ? (
                      <Button
                        variant="link"
                        onClick={() => navigateToPage(link.page as any)}
                        className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 pl-0"
                      >
                        {link.name}
                      </Button>
                    ) : (
                      <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors duration-300">
                        {link.name}
                      </a>
                    )}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h4 className="text-lg font-semibold mb-6 text-white">Legal</h4>
              <ul className="space-y-1">
                {[
                  { name: "Terms & Conditions", page: "terms" },
                  { name: "Privacy Policy", page: "privacy" },
                  { name: "Return Policy", page: "returns" },
                ].map((link) => (
                  <motion.li key={link.name} whileHover={{ x: 5 }}>
                    <Button
                      variant="link"
                      onClick={() => navigateToPage(link.page as any)}
                      className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 pl-0"
                    >
                      {link.name}
                    </Button>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h4 className="text-lg font-semibold mb-6 text-white">Connect With Us</h4>
              <div className="space-y-3 text-gray-300 mb-6">
                <p>📧 rs.sparshnaturals@gmail.com</p>
                <p>📞 +91 9409073136</p>
                <p>📍 Bhavnagar, Gujarat</p>
              </div>
              <div className="flex space-x-4">
                {["F", "I", "T"].map((social, index) => (
                  <motion.a
                    key={social}
                    href="#"
                    className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {social}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="border-t border-emerald-700 mt-12 pt-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-400">
              &copy; 2025 SPARSH by R Naturals. All rights reserved. Transform your hair naturally. 🌿
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}
