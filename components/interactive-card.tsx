"use client"

import type React from "react"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useRef, type ReactNode } from "react"

interface InteractiveCardProps {
  children: ReactNode
  className?: string
  glowColor?: string
  intensity?: number
}

export function InteractiveCard({
  children,
  className = "",
  glowColor = "emerald",
  intensity = 0.1,
}: InteractiveCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct * intensity)
    y.set(yPct * intensity)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      className={`relative group ${className}`}
    >
      {/* Glow effect */}
      <div
        className={`absolute inset-0 bg-gradient-to-r from-${glowColor}-400/20 to-${glowColor}-600/20 rounded-inherit opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl`}
      />

      {/* Content */}
      <div
        style={{
          transform: "translateZ(50px)",
        }}
        className="relative z-10"
      >
        {children}
      </div>
    </motion.div>
  )
}
