"use client"

import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import { EmailService } from "@/components/email-service"

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

      // Handle Google sign-in profile creation
      if (event === "SIGNED_IN" && session?.user) {
        await handleUserProfile(session.user)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleUserProfile = async (user: User) => {
    try {
      // Check if profile already exists
      const { data: existingProfile } = await supabase.from("profiles").select("id").eq("id", user.id).single()

      if (!existingProfile) {
        // Create profile for new user
        const profileData = {
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
          avatar_url: user.user_metadata?.avatar_url || null,
          provider: user.app_metadata?.provider || "email",
        }

        const { error: profileError } = await supabase.from("profiles").insert(profileData)

        if (profileError) {
          console.error("Profile creation error:", profileError)
        } else {
          console.log("Profile created successfully")

          // Send welcome email for new users
          if (user.email) {
            try {
              await EmailService.sendSignupConfirmation({
                email: user.email,
                fullName: profileData.full_name,
              })
            } catch (emailError) {
              console.warn("Failed to send welcome email:", emailError)
            }
          }
        }
      }
    } catch (error) {
      console.error("Error handling user profile:", error)
    }
  }

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
        await handleUserProfile(data.user)
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

  const signInWithGoogle = async () => {
    try {
      console.log("Attempting Google signin...")

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      })

      if (error) {
        console.error("Google signin error:", error)
        throw error
      }

      console.log("Google signin initiated")
      return data
    } catch (error: any) {
      console.error("Google signin process error:", error)
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
    signInWithGoogle,
    signOut,
    resetPassword,
    updateProfile,
    getProfile,
  }
}
