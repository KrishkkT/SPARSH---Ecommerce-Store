"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, ContactShadows, Float } from "@react-three/drei"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { RotateCcw, ZoomIn, ZoomOut, Play, Pause } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type * as THREE from "three"

function PremiumBottleModel({ scale = 1, position = [0, 0, 0], isAnimating = true, productType = "shampoo" }) {
  const meshRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current && isAnimating) {
      meshRef.current.rotation.y += hovered ? 0.01 : 0.003
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1
    }
  })

  const getProductColor = () => {
    switch (productType) {
      case "shampoo":
        return "#10b981"
      case "oil":
        return "#f59e0b"
      case "mask":
        return "#8b5cf6"
      case "gel":
        return "#06b6d4"
      default:
        return "#10b981"
    }
  }

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group
        ref={meshRef}
        scale={scale}
        position={position}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        {/* Main bottle body with glass effect */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.8, 0.6, 2.5, 32]} />
          <meshPhysicalMaterial
            color={getProductColor()}
            transparent
            opacity={0.85}
            roughness={0.05}
            metalness={0.1}
            transmission={0.3}
            thickness={0.5}
          />
        </mesh>

        {/* Bottle neck */}
        <mesh position={[0, 1.5, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.4, 0.8, 16]} />
          <meshPhysicalMaterial color={getProductColor()} transparent opacity={0.9} roughness={0.1} metalness={0.2} />
        </mesh>

        {/* Premium cap with metallic finish */}
        <mesh position={[0, 2.1, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.4, 16]} />
          <meshStandardMaterial color="#1f2937" roughness={0.2} metalness={0.8} />
        </mesh>

        {/* Elegant label */}
        <mesh position={[0, 0.2, 0.81]}>
          <planeGeometry args={[1.2, 1.5]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.95} />
        </mesh>

        {/* Brand text area */}
        <mesh position={[0, 0.5, 0.82]}>
          <planeGeometry args={[0.8, 0.3]} />
          <meshStandardMaterial color={getProductColor()} />
        </mesh>

        {/* Product info */}
        <mesh position={[0, 0, 0.82]}>
          <planeGeometry args={[1.0, 0.2]} />
          <meshStandardMaterial color="#374151" />
        </mesh>

        {/* Decorative elements */}
        <mesh position={[0, -0.3, 0.82]}>
          <planeGeometry args={[0.6, 0.15]} />
          <meshStandardMaterial color="#6b7280" />
        </mesh>

        {/* Floating particles around the bottle */}
        {[...Array(8)].map((_, i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i / 8) * Math.PI * 2) * 1.5,
              Math.sin((i / 8) * Math.PI * 2) * 0.5,
              Math.sin((i / 8) * Math.PI * 2) * 1.5,
            ]}
          >
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial color={getProductColor()} emissive={getProductColor()} emissiveIntensity={0.3} />
          </mesh>
        ))}
      </group>
    </Float>
  )
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full"
      />
    </div>
  )
}

interface Premium3DProductProps {
  scale?: number
  position?: [number, number, number]
  backgroundColor?: string
  productType?: "shampoo" | "oil" | "mask" | "gel"
  productName?: string
  showControls?: boolean
}

export default function Premium3DProduct({
  scale = 1,
  position = [0, -1, 0],
  backgroundColor = "#f0fdf4",
  productType = "shampoo",
  productName = "SPARSH Natural",
  showControls = true,
}: Premium3DProductProps) {
  const [zoom, setZoom] = useState(5)
  const [isAnimating, setIsAnimating] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const controlsRef = useRef<any>()

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleZoomIn = () => {
    if (zoom > 2) setZoom(zoom - 1)
  }

  const handleZoomOut = () => {
    if (zoom < 10) setZoom(zoom + 1)
  }

  const handleReset = () => {
    if (controlsRef.current) {
      controlsRef.current.reset()
    }
    setZoom(5)
  }

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="relative w-full h-[400px] rounded-3xl overflow-hidden shadow-2xl"
      style={{
        background: `linear-gradient(135deg, ${backgroundColor}, rgba(16, 185, 129, 0.1))`,
      }}
    >
      <Canvas shadows camera={{ position: [0, 0, zoom], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.2} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.3} color="#10b981" />
          <directionalLight position={[0, 10, 5]} intensity={0.5} />

          <PremiumBottleModel scale={scale} position={position} isAnimating={isAnimating} productType={productType} />

          <Environment preset="city" />
          <ContactShadows position={[0, -2, 0]} opacity={0.3} scale={8} blur={3} far={4} />

          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            minDistance={2}
            maxDistance={10}
            autoRotate={false}
            enableDamping
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>

      {/* Product info overlay */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute top-4 left-4 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/20"
      >
        <h3 className="font-bold text-emerald-800 text-lg">{productName}</h3>
        <p className="text-sm text-gray-600 capitalize">{productType} Collection</p>
        <div className="flex items-center mt-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
          <span className="text-xs text-gray-500">Premium Quality</span>
        </div>
      </motion.div>

      {/* Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 right-4 flex gap-2"
          >
            <Button
              variant="secondary"
              size="icon"
              onClick={handleZoomIn}
              className="bg-white/80 hover:bg-white shadow-lg backdrop-blur-sm border border-white/20"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={handleZoomOut}
              className="bg-white/80 hover:bg-white shadow-lg backdrop-blur-sm border border-white/20"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={toggleAnimation}
              className="bg-white/80 hover:bg-white shadow-lg backdrop-blur-sm border border-white/20"
            >
              {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={handleReset}
              className="bg-white/80 hover:bg-white shadow-lg backdrop-blur-sm border border-white/20"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading overlay */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center"
          >
            <LoadingSpinner />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
