"use client"

import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Error getting session:", error)
        }

        setUser(session?.user ?? null)
      } catch (error) {
        console.error("Session error:", error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      // Validate inputs
      if (!email || !password) {
        return { data: null, error: { message: "Email and password are required" } }
      }

      if (password.length < 6) {
        return { data: null, error: { message: "Password must be at least 6 characters long" } }
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: fullName?.trim() || null,
          },
        },
      })

      if (error) {
        console.error("Signup error:", error)
        return { data, error }
      }

      if (data.user && !error) {
        // Create profile
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          email: data.user.email!,
          full_name: fullName?.trim() || null,
        })

        if (profileError) {
          console.error("Profile creation error:", profileError)
          // Don't fail signup if profile creation fails
        }
      }

      return { data, error }
    } catch (error: any) {
      console.error("Signup exception:", error)
      return { data: null, error: { message: "An unexpected error occurred during signup" } }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      // Validate inputs
      if (!email || !password) {
        return { data: null, error: { message: "Email and password are required" } }
      }

      // Clean email input
      const cleanEmail = email.trim().toLowerCase()

      console.log("Attempting login for:", cleanEmail)

      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password,
      })

      if (error) {
        console.error("Login error:", error)

        // Provide more specific error messages
        if (error.message.includes("Invalid login credentials")) {
          return {
            data,
            error: {
              message: "Invalid email or password. Please check your credentials and try again.",
            },
          }
        } else if (error.message.includes("Email not confirmed")) {
          return {
            data,
            error: {
              message: "Please check your email and click the confirmation link before logging in.",
            },
          }
        } else if (error.message.includes("Too many requests")) {
          return {
            data,
            error: {
              message: "Too many login attempts. Please wait a few minutes before trying again.",
            },
          }
        }

        return { data, error }
      }

      console.log("Login successful for:", cleanEmail)
      return { data, error }
    } catch (error: any) {
      console.error("Login exception:", error)
      return {
        data: null,
        error: { message: "An unexpected error occurred during login. Please try again." },
      }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("Logout error:", error)
        return { error }
      }
      return { error: null }
    } catch (error: any) {
      console.error("Logout exception:", error)
      return { error: { message: "An error occurred during logout" } }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      if (!email) {
        return { error: { message: "Email is required" } }
      }

      const cleanEmail = email.trim().toLowerCase()

      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        console.error("Password reset error:", error)
        return { error }
      }

      return { error: null }
    } catch (error: any) {
      console.error("Password reset exception:", error)
      return { error: { message: "An error occurred while sending reset email" } }
    }
  }

  const updatePassword = async (newPassword: string) => {
    try {
      if (!newPassword || newPassword.length < 6) {
        return { error: { message: "Password must be at least 6 characters long" } }
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        console.error("Password update error:", error)
        return { error }
      }

      return { error: null }
    } catch (error: any) {
      console.error("Password update exception:", error)
      return { error: { message: "An error occurred while updating password" } }
    }
  }

  const updateProfile = async (updates: {
    full_name?: string
    phone?: string
    address?: string
  }) => {
    try {
      if (!user) return { error: new Error("No user logged in") }

      const { data, error } = await supabase
        .from("profiles")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select()
        .single()

      if (error) {
        console.error("Profile update error:", error)
        return { data: null, error }
      }

      return { data, error: null }
    } catch (error: any) {
      console.error("Profile update exception:", error)
      return { data: null, error: { message: "An error occurred while updating profile" } }
    }
  }

  const getProfile = async () => {
    try {
      if (!user) return { data: null, error: new Error("No user logged in") }

      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (error) {
        console.error("Get profile error:", error)
        return { data: null, error }
      }

      return { data, error: null }
    } catch (error: any) {
      console.error("Get profile exception:", error)
      return { data: null, error: { message: "An error occurred while fetching profile" } }
    }
  }

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    getProfile,
  }
}
