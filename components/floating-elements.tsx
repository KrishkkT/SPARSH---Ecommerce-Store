"use client"

import { motion } from "framer-motion"
import { Leaf, Droplets, Sparkles, Heart } from "lucide-react"

const floatingIcons = [Leaf, Droplets, Sparkles, Heart]

export function FloatingElements() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(15)].map((_, i) => {
        const Icon = floatingIcons[i % floatingIcons.length]
        return (
          <motion.div
            key={i}
            className="absolute text-emerald-200/20"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * -200],
              rotate: [0, 360],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 10,
              ease: "linear",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${100 + Math.random() * 20}%`,
            }}
          >
            <Icon className="w-8 h-8" />
          </motion.div>
        )
      })}
    </div>
  )
}
