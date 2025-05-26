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

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const { user, signUp } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/")
    }
  }, [user, router])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      setLoading(false)
      return
    }

    try {
      await signUp(formData.email, formData.password, formData.fullName)
      setSuccess(true)
      // Success - redirect will happen via useEffect
    } catch (err: any) {
      setError(err.message || "Signup failed")
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
            Create Account
          </motion.h1>

          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-emerald-600 text-sm bg-emerald-50 p-4 rounded-xl border border-emerald-200 mb-6"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Account created successfully! Redirecting...</span>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSignup} className="space-y-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <Label htmlFor="fullName" className="text-gray-700 font-medium">
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                className="mt-2 bg-white/80 backdrop-blur-sm border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl"
                placeholder="Enter your full name"
                disabled={loading}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className="mt-2 bg-white/80 backdrop-blur-sm border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl"
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Password *
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  className="mt-2 pr-12 bg-white/80 backdrop-blur-sm border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl"
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
                <motion.button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-emerald-600"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </motion.button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
              <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                Confirm Password *
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                className="mt-2 bg-white/80 backdrop-blur-sm border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl"
                placeholder="Confirm your password"
                required
                disabled={loading}
              />
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-red-600 text-sm bg-red-50 p-4 rounded-xl border border-red-200"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
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
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700 text-white shadow-lg py-3 rounded-xl font-semibold"
              >
                {loading ? (
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
              <Button
                variant="link"
                onClick={() => router.push("/login")}
                className="text-emerald-600 hover:text-emerald-700 font-medium p-0"
                disabled={loading}
              >
                Sign in here
              </Button>
            </p>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  )
}
