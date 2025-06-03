"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "./toast-provider"

export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

interface CartContextType {
  cart: CartItem[]
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  addToCart: (product: any) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  getTotalPrice: () => number
  getTotalItems: () => number
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

interface CartProviderProps {
  children: ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { addToast } = useToast()

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("sparsh-cart")
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("sparsh-cart", JSON.stringify(cart))
  }, [cart])

  const addToCart = (product: any) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)

      if (existingItem) {
        const updatedCart = prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )

        addToast({
          type: "success",
          title: "Quantity Updated!",
          description: `${product.name} quantity increased to ${existingItem.quantity + 1}`,
          action: {
            label: "View Cart",
            onClick: () => setIsCartOpen(true),
          },
        })

        return updatedCart
      } else {
        const newItem: CartItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
        }

        addToast({
          type: "success",
          title: "Added to Cart!",
          description: `${product.name} has been added to your cart`,
          action: {
            label: "View Cart",
            onClick: () => setIsCartOpen(true),
          },
        })

        return [...prevCart, newItem]
      }
    })
  }

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => {
      const item = prevCart.find((item) => item.id === productId)
      if (item) {
        addToast({
          type: "info",
          title: "Item Removed",
          description: `${item.name} has been removed from your cart`,
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

  const clearCart = () => {
    setCart([])
    addToast({
      type: "success",
      title: "Cart Cleared",
      description: "All items have been removed from your cart",
    })
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        getTotalPrice,
        getTotalItems,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
