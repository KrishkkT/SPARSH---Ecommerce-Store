"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Auth callback error:", error)
          router.push("/login?error=auth_callback_failed")
          return
        }

        if (data.session) {
          console.log("Auth callback successful, user logged in")

          // Create profile if it doesn't exist
          try {
            const { data: profile } = await supabase
              .from("profiles")
              .select("id")
              .eq("id", data.session.user.id)
              .single()

            if (!profile) {
              console.log("Creating user profile...")
              await supabase.from("profiles").insert({
                id: data.session.user.id,
                email: data.session.user.email!,
                full_name: data.session.user.user_metadata?.full_name || null,
              })
            }
          } catch (profileError) {
            console.warn("Profile creation/check failed:", profileError)
          }

          router.push("/")
        } else {
          console.log("No session found in auth callback")
          router.push("/login")
        }
      } catch (error) {
        console.error("Auth callback handling error:", error)
        router.push("/login?error=callback_error")
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  )
}
