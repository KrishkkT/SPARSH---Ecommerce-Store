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
        } = await supabase.auth.getSession()
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
      console.log("Auth state changed:", event)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      console.log("Attempting signup for:", email)

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || null,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        console.error("Signup error:", error)
        throw error
      }

      console.log("Signup successful:", data)

      // Create profile if user was created
      if (data.user && !data.user.email_confirmed_at) {
        console.log("User created, email confirmation required")
        // Don't create profile yet, wait for email confirmation
      } else if (data.user) {
        console.log("Creating user profile...")
        try {
          await supabase.from("profiles").insert({
            id: data.user.id,
            email: data.user.email!,
            full_name: fullName || null,
          })
          console.log("Profile created successfully")
        } catch (profileError) {
          console.warn("Profile creation failed:", profileError)
          // Don't throw error for profile creation failure
        }
      }

      return data
    } catch (error: any) {
      console.error("Signup process error:", error)
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting signin for:", email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Signin error:", error)
        throw error
      }

      console.log("Signin successful")
      return data
    } catch (error: any) {
      console.error("Signin process error:", error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      console.log("Signout successful")
    } catch (error: any) {
      console.error("Signout error:", error)
      throw error
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      if (error) throw error
      console.log("Password reset email sent")
    } catch (error: any) {
      console.error("Password reset error:", error)
      throw error
    }
  }

  const updateProfile = async (updates: { full_name?: string; phone?: string; address?: string }) => {
    if (!user) throw new Error("No user logged in")

    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error: any) {
      console.error("Profile update error:", error)
      throw error
    }
  }

  const getProfile = async () => {
    if (!user) throw new Error("No user logged in")

    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (error) throw error
      return data
    } catch (error: any) {
      console.error("Get profile error:", error)
      throw error
    }
  }

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    getProfile,
  }
}
