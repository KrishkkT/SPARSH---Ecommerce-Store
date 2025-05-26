"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/useAuth"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetEmailSent, setResetEmailSent] = useState(false)

  const { user, signIn, resetPassword } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/")
    }
  }, [user, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await signIn(email, password)
    } catch (err: any) {
      console.error("Login error:", err)
      if (err.message?.includes("Invalid login credentials")) {
        setError("Invalid email or password")
      } else if (err.message?.includes("Email not confirmed")) {
        setError("Please check your email and confirm your account")
      } else {
        setError(err.message || "Login failed")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await resetPassword(resetEmail)
      setResetEmailSent(true)
    } catch (err: any) {
      setError(err.message || "Failed to send reset email")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 bg-white/95 backdrop-blur-md shadow-2xl border-0 relative overflow-hidden rounded-3xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500" />

          <motion.h1
            className="text-3xl font-bold text-center bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Welcome Back
          </motion.h1>

          {!showForgotPassword ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 bg-white/80 backdrop-blur-sm border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl"
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password *
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-2 pr-12 bg-white/80 backdrop-blur-sm border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl"
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-emerald-600"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-4 rounded-xl border border-red-200">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700 text-white shadow-lg py-3 rounded-xl font-semibold"
              >
                {loading ? "Signing in..." : "Login"}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                  disabled={loading}
                >
                  Forgot your password?
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div>
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
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-4 rounded-xl border border-red-200">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {resetEmailSent && (
                <div className="text-emerald-600 text-sm bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Password reset email sent! Please check your inbox.</span>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700 text-white shadow-lg py-3 rounded-xl font-semibold"
              >
                {loading ? "Sending..." : "Send Reset Email"}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false)
                    setResetEmail("")
                    setResetEmailSent(false)
                    setError("")
                  }}
                  className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                  disabled={loading}
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Button
                variant="link"
                onClick={() => router.push("/signup")}
                className="text-emerald-600 hover:text-emerald-700 font-medium p-0"
                disabled={loading}
              >
                Sign up here
              </Button>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
