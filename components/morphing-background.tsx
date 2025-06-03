"use client"

import { motion } from "framer-motion"

export function MorphingBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Animated gradient blobs */}
      <motion.div
        className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-300/30 to-green-400/30 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      <motion.div
        className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-teal-300/20 to-emerald-400/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 0.8, 1],
          rotate: [360, 180, 0],
          x: [0, -30, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 25,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      <motion.div
        className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-green-300/15 to-emerald-300/15 rounded-full blur-2xl"
        animate={{
          scale: [1, 1.5, 1],
          x: [-50, 50, -50],
          y: [-30, 30, -30],
        }}
        transition={{
          duration: 30,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}
