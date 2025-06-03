"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"

interface Fallback3DProductProps {
  backgroundColor?: string
  productName?: string
  productType?: string
}

export function Fallback3DProduct({
  backgroundColor = "#f0fdf4",
  productName = "SPARSH Natural Hair Care",
  productType = "shampoo",
}: Fallback3DProductProps) {
  const [rotation, setRotation] = useState(0)

  const handleRotate = () => {
    setRotation((prev) => prev + 90)
  }

  const getProductColor = () => {
    switch (productType) {
      case "shampoo":
        return "from-emerald-400 to-emerald-600"
      case "oil":
        return "from-amber-400 to-amber-600"
      case "mask":
        return "from-purple-400 to-purple-600"
      case "gel":
        return "from-cyan-400 to-cyan-600"
      default:
        return "from-emerald-400 to-emerald-600"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full h-[400px] rounded-2xl overflow-hidden flex items-center justify-center"
      style={{ backgroundColor }}
    >
      {/* 3D-like bottle representation using CSS transforms */}
      <motion.div
        className="relative"
        animate={{ rotateY: rotation }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Bottle shadow */}
        <div className="absolute inset-0 bg-black/20 blur-xl transform translate-y-8 scale-110 rounded-full" />

        {/* Main bottle */}
        <div className="relative w-32 h-64 mx-auto">
          {/* Bottle body */}
          <div
            className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-48 bg-gradient-to-b ${getProductColor()} rounded-t-3xl rounded-b-lg shadow-2xl`}
          >
            {/* Bottle highlight */}
            <div className="absolute top-4 left-2 w-3 h-32 bg-white/30 rounded-full blur-sm" />

            {/* Label */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-16 h-24 bg-white/90 rounded-lg shadow-lg flex flex-col items-center justify-center p-2">
              <div className={`w-12 h-3 bg-gradient-to-r ${getProductColor()} rounded mb-2`} />
              <div className="w-10 h-1 bg-gray-400 rounded mb-1" />
              <div className="w-8 h-1 bg-gray-400 rounded mb-1" />
              <div className="w-6 h-1 bg-gray-400 rounded" />
            </div>
          </div>

          {/* Bottle neck */}
          <div
            className={`absolute bottom-48 left-1/2 transform -translate-x-1/2 w-8 h-12 bg-gradient-to-b ${getProductColor()} rounded-t-lg shadow-lg`}
          />

          {/* Bottle cap */}
          <div className="absolute bottom-60 left-1/2 transform -translate-x-1/2 w-10 h-6 bg-gradient-to-b from-gray-700 to-gray-800 rounded-lg shadow-lg">
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-gray-900 rounded" />
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      <div className="absolute bottom-4 right-4">
        <Button variant="secondary" size="icon" onClick={handleRotate} className="bg-white/80 hover:bg-white shadow-md">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Product Info Overlay */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <h3 className="font-semibold text-emerald-800">SPARSH Natural</h3>
        <p className="text-sm text-gray-600 capitalize">{productType} Collection</p>
      </div>
    </motion.div>
  )
}
