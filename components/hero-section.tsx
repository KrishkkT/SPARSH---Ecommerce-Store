"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight, Play, Pause } from "lucide-react"
import { ScrollAnimation } from "@/components/scroll-animation"
import Premium3DProduct from "@/components/premium-3d-product"

const heroImages = [
  {
    url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1920&auto=format&fit=crop&q=80",
    alt: "Beautiful woman with healthy natural hair",
    title: "Transform Your Hair Naturally",
    subtitle: "Premium Natural Hair Care",
  },
  {
    url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1920&auto=format&fit=crop&q=80",
    alt: "Natural hair care ingredients",
    title: "Pure Natural Ingredients",
    subtitle: "Handcrafted with Love",
  },
  {
    url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&auto=format&fit=crop&q=80",
    alt: "Luxurious hair care routine",
    title: "Luxury Hair Care Experience",
    subtitle: "Professional Results at Home",
  },
]

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const currentImage = heroImages[currentImageIndex]

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Image Carousel */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${currentImage.url})`,
              }}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * -200],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          {/* Text Content */}
          <ScrollAnimation direction="left" duration={1}>
            <div className="text-white">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="mb-6"
              >
                <motion.span
                  className="inline-block px-4 py-2 bg-emerald-500/20 backdrop-blur-sm rounded-full text-emerald-300 text-sm font-medium border border-emerald-400/30"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(16, 185, 129, 0.3)" }}
                >
                  ✨ Premium Natural Hair Care
                </motion.span>
              </motion.div>

              <motion.h1
                className="text-5xl lg:text-7xl font-bold mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentImageIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.8 }}
                    className="block"
                  >
                    {currentImage.title}
                  </motion.span>
                </AnimatePresence>
                <motion.div
                  className="inline-block ml-4"
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <Sparkles className="w-12 h-12 text-emerald-400" />
                </motion.div>
              </motion.h1>

              <motion.p
                className="text-xl lg:text-2xl text-gray-200 mb-8 leading-relaxed max-w-2xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    {currentImage.subtitle}
                  </motion.span>
                </AnimatePresence>
                <br />
                Experience the power of nature with our handcrafted hair care products, designed to nourish, protect,
                and transform your hair naturally.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.8 }}
              >
                <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="group">
                  <Button
                    size="lg"
                    onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
                    className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-8 py-4 rounded-xl shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 group-hover:shadow-2xl"
                  >
                    <Sparkles className="w-5 h-5 mr-2 group-hover:animate-spin" />
                    Discover Products
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => (window.location.href = "/hair-solutions")}
                    className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 rounded-xl transition-all duration-300"
                  >
                    Learn More
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </ScrollAnimation>

          {/* 3D Product Showcase */}
          <ScrollAnimation direction="right" duration={1} delay={0.3}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ delay: 1.3, duration: 1, ease: "easeOut" }}
              className="relative"
            >
              <Premium3DProduct
                scale={1.5}
                position={[0, -0.5, 0]}
                backgroundColor="rgba(255, 255, 255, 0.1)"
                productType="shampoo"
                productName="SPARSH Premium Collection"
                showControls={true}
              />

              {/* Floating Info Cards */}
              <motion.div
                className="absolute -top-4 -left-4 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 2, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <div className="text-emerald-600 font-bold text-lg">100%</div>
                <div className="text-gray-600 text-sm">Natural</div>
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -right-4 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl"
                animate={{
                  y: [0, 10, 0],
                  rotate: [0, -2, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 1,
                }}
              >
                <div className="text-emerald-600 font-bold text-lg">4.9★</div>
                <div className="text-gray-600 text-sm">Rating</div>
              </motion.div>
            </motion.div>
          </ScrollAnimation>
        </div>
      </div>

      {/* Image Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </motion.button>

          <div className="flex space-x-2">
            {heroImages.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentImageIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 right-8 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        <div className="flex flex-col items-center text-white/70">
          <span className="text-sm mb-2 rotate-90 origin-center">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/70 to-transparent" />
        </div>
      </motion.div>
    </section>
  )
}
