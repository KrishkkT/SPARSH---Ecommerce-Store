"use client"

import { motion } from "framer-motion"

interface LoadingAnimationProps {
  size?: "sm" | "md" | "lg"
  color?: string
  text?: string
}

export function LoadingAnimation({ size = "md", color = "emerald", text }: LoadingAnimationProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        {/* Outer ring */}
        <motion.div
          className={`${sizeClasses[size]} border-4 border-${color}-200 rounded-full`}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />

        {/* Inner ring */}
        <motion.div
          className={`absolute inset-0 ${sizeClasses[size]} border-4 border-transparent border-t-${color}-600 rounded-full`}
          animate={{ rotate: -360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />

        {/* Center dot */}
        <motion.div
          className={`absolute inset-0 m-auto w-2 h-2 bg-${color}-600 rounded-full`}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
      </div>

      {text && (
        <motion.p
          className={`${textSizes[size]} text-gray-600 font-medium`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}
