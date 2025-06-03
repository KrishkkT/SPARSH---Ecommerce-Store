"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react"
import { motion } from "framer-motion"

function BottleModel({ scale = 1, position = [0, 0, 0] }) {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003
    }
  })

  return (
    <group ref={meshRef} scale={scale} position={position}>
      {/* Bottle Body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.8, 0.6, 2.5, 32]} />
        <meshStandardMaterial color="#10b981" transparent opacity={0.8} roughness={0.1} metalness={0.1} />
      </mesh>

      {/* Bottle Neck */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 0.8, 16]} />
        <meshStandardMaterial color="#059669" transparent opacity={0.9} roughness={0.1} metalness={0.1} />
      </mesh>

      {/* Bottle Cap */}
      <mesh position={[0, 2.1, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.4, 16]} />
        <meshStandardMaterial color="#065f46" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Label */}
      <mesh position={[0, 0.2, 0.81]}>
        <planeGeometry args={[1.2, 1.5]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.9} />
      </mesh>

      {/* Label Text Simulation */}
      <mesh position={[0, 0.5, 0.82]}>
        <planeGeometry args={[0.8, 0.3]} />
        <meshStandardMaterial color="#10b981" />
      </mesh>

      <mesh position={[0, 0, 0.82]}>
        <planeGeometry args={[1.0, 0.2]} />
        <meshStandardMaterial color="#374151" />
      </mesh>

      <mesh position={[0, -0.3, 0.82]}>
        <planeGeometry args={[0.6, 0.15]} />
        <meshStandardMaterial color="#6b7280" />
      </mesh>
    </group>
  )
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>
  )
}

export default function Product3DViewer({ scale = 1, position = [0, -1, 0], backgroundColor = "#f0fdf4" }) {
  const [zoom, setZoom] = useState(5)
  const controlsRef = useRef()

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full h-[400px] rounded-2xl overflow-hidden"
      style={{ backgroundColor }}
    >
      <Canvas shadows>
        <Suspense fallback={<LoadingSpinner />}>
          <ambientLight intensity={0.6} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.3} />
          <BottleModel scale={scale} position={position} />
          <Environment preset="sunset" />
          <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={5} blur={2.4} />
          <OrbitControls ref={controlsRef} enablePan={false} minDistance={2} maxDistance={10} autoRotate={false} />
        </Suspense>
      </Canvas>

      <div className="absolute bottom-4 right-4 flex gap-2">
        <Button variant="secondary" size="icon" onClick={handleZoomIn} className="bg-white/80 hover:bg-white shadow-md">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={handleZoomOut}
          className="bg-white/80 hover:bg-white shadow-md"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon" onClick={handleReset} className="bg-white/80 hover:bg-white shadow-md">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Product Info Overlay */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <h3 className="font-semibold text-emerald-800">SPARSH Natural</h3>
        <p className="text-sm text-gray-600">Hair Care Product</p>
      </div>
    </motion.div>
  )
}
