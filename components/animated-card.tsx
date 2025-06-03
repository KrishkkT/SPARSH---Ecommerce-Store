"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"
import { Card } from "@/components/ui/card"

interface AnimatedCardProps {
  children: ReactNode
  delay?: number
  className?: string
  hoverScale?: number
}

export function AnimatedCard({ children, delay = 0, className = "", hoverScale = 1.02 }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{
        scale: hoverScale,
        transition: { duration: 0.2 },
      }}
      className="h-full"
    >
      <Card className={`h-full shadow-lg hover:shadow-2xl transition-all duration-300 ${className}`}>{children}</Card>
    </motion.div>
  )
}
