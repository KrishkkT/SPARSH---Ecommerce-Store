"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function AuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState("Processing authentication...")

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle hash fragment for OAuth providers (like Google)
        if (window.location.hash) {
          setStatus("Processing OAuth callback...")
          const { data, error } = await supabase.auth.getSession()

          if (error) {
            console.error("Auth callback error:", error)
            setStatus("Authentication failed. Redirecting to login...")
            router.push("/login?error=auth_callback_failed")
            return
          }

          if (data.session) {
            console.log("OAuth authentication successful")
            await handleUserProfile(data.session.user)
            router.push("/")
            return
          }
        }

        // Handle regular email auth callback
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Auth callback error:", error)
          setStatus("Authentication failed. Redirecting to login...")
          router.push("/login?error=auth_callback_failed")
          return
        }

        if (data.session) {
          console.log("Auth callback successful, user logged in")
          await handleUserProfile(data.session.user)
          router.push("/")
        } else {
          console.log("No session found in auth callback")
          setStatus("No session found. Redirecting to login...")
          router.push("/login")
        }
      } catch (error) {
        console.error("Auth callback handling error:", error)
        setStatus("An error occurred. Redirecting to login...")
        router.push("/login?error=callback_error")
      }
    }

    handleAuthCallback()
  }, [router])

  const handleUserProfile = async (user: any) => {
    try {
      const { data: profile } = await supabase.from("profiles").select("id").eq("id", user.id).single()

      if (!profile) {
        console.log("Creating user profile...")

        // Get user metadata
        const fullName = user.user_metadata?.full_name || user.user_metadata?.name || null

        const avatarUrl = user.user_metadata?.avatar_url || null
        const provider = user.app_metadata?.provider || "email"

        await supabase.from("profiles").insert({
          id: user.id,
          email: user.email!,
          full_name: fullName,
          avatar_url: avatarUrl,
          provider: provider,
        })

        console.log("Profile created successfully")
      }
    } catch (profileError) {
      console.warn("Profile creation/check failed:", profileError)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100">
      <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-6"></div>
        <h2 className="text-2xl font-semibold text-emerald-700 mb-2">Completing Authentication</h2>
        <p className="text-gray-600">{status}</p>
        <div className="mt-6 text-sm text-gray-500">
          You will be redirected automatically. Please don't close this window.
        </div>
      </div>
    </div>
  )
}
