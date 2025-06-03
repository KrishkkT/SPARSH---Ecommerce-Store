"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface PremiumAnimatedCardProps {
  children: ReactNode
  delay?: number
  className?: string
  glowEffect?: boolean
  tiltEffect?: boolean
}

export function PremiumAnimatedCard({
  children,
  delay = 0,
  className = "",
  glowEffect = false,
  tiltEffect = false,
}: PremiumAnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={
        tiltEffect
          ? {
              scale: 1.02,
              rotateX: 5,
              rotateY: 5,
              transition: { duration: 0.3 },
            }
          : { scale: 1.02 }
      }
      className={`
        relative bg-white/95 backdrop-blur-md border-0 shadow-lg hover:shadow-xl transition-all duration-300
        ${glowEffect ? "hover:shadow-emerald-200/50" : ""}
        ${className}
      `}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      {glowEffect && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-green-400/20 rounded-inherit opacity-0 transition-opacity duration-300"
          whileHover={{ opacity: 1 }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}
