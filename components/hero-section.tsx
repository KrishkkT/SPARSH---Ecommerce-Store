"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight, Play, Pause, Leaf, Star, Heart, Award } from "lucide-react"
import { ScrollAnimation } from "@/components/scroll-animation"

const heroImages = [
  {
    url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1920&auto=format&fit=crop&q=80",
    alt: "Beautiful woman with healthy natural hair",
    title: "Transform Your Hair Naturally",
    subtitle: "Premium Natural Hair Care",
  },
  {
    url: "https://images.unsplash.com/photo-1497433550656-7fb185be365e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTh8fGhhaXIlMjBjYXJlfGVufDB8fDB8fHww",
    alt: "Natural hair care ingredients",
    title: "Pure Natural Ingredients",
    subtitle: "Handcrafted with Love",
  },
  {
    url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzF8fGhhaXIlMjBjYXJlfGVufDB8fDB8fHww",
    alt: "Luxurious hair care routine",
    title: "Luxury Hair Care Experience",
    subtitle: "Professional Results at Home",
  },
]

const floatingElements = [
  { icon: Leaf, color: "text-emerald-400", delay: 0 },
  { icon: Star, color: "text-yellow-400", delay: 1 },
  { icon: Heart, color: "text-pink-400", delay: 2 },
  { icon: Award, color: "text-blue-400", delay: 3 },
]

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 4000)

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
            {/* Enhanced Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-transparent to-green-900/20" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Enhanced Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            animate={{
              x: [0, Math.random() * 300 - 150],
              y: [0, Math.random() * -300],
              opacity: [0, 1, 0],
              scale: [0, Math.random() * 1.5 + 0.5, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 5,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 8,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingElements.map((element, i) => (
          <motion.div
            key={i}
            className={`absolute ${element.color}`}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.sin(i) * 20, 0],
              rotate: [0, 360],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 8 + i,
              repeat: Number.POSITIVE_INFINITY,
              delay: element.delay,
              ease: "easeInOut",
            }}
            style={{
              left: `${20 + i * 20}%`,
              top: `${30 + i * 15}%`,
            }}
          >
            <element.icon className="w-8 h-8" />
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          {/* Enhanced Text Content */}
          <ScrollAnimation direction="left" duration={1}>
            <div className="text-white">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="mb-6"
              >
                <motion.span
                  className="inline-block px-6 py-3 bg-emerald-500/20 backdrop-blur-sm rounded-full text-emerald-300 text-sm font-medium border border-emerald-400/30"
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "rgba(16, 185, 129, 0.3)",
                    borderColor: "rgba(16, 185, 129, 0.5)",
                  }}
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(16, 185, 129, 0)",
                      "0 0 0 10px rgba(16, 185, 129, 0.1)",
                      "0 0 0 0 rgba(16, 185, 129, 0)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
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
                    scale: [1, 1.2, 1],
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
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="mr-2"
                    >
                      <Sparkles className="w-5 h-5" />
                    </motion.div>
                    Discover Products
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
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

          {/* Enhanced Visual Elements */}
          <ScrollAnimation direction="right" duration={1} delay={0.3}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ delay: 1.3, duration: 1, ease: "easeOut" }}
              className="relative"
            >
              {/* Floating Info Cards */}
              <motion.div
                className="absolute -top-4 -left-4 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl"
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 3, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <div className="text-emerald-600 font-bold text-2xl">100%</div>
                <div className="text-gray-600 text-sm">Natural</div>
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -right-4 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl"
                animate={{
                  y: [0, 15, 0],
                  rotate: [0, -3, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 1,
                }}
              >
                <div className="text-emerald-600 font-bold text-2xl">4.9★</div>
                <div className="text-gray-600 text-sm">Rating</div>
              </motion.div>

              <motion.div
                className="absolute top-1/2 -right-8 bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-xl"
                animate={{
                  x: [0, 10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 2,
                }}
              >
                <div className="text-emerald-600 font-bold text-lg">500+</div>
                <div className="text-gray-600 text-xs">Happy Customers</div>
              </motion.div>
            </motion.div>
          </ScrollAnimation>
        </div>
      </div>

      {/* Enhanced Image Navigation 
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isAutoPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </motion.button>

          <div className="flex space-x-3">
            {heroImages.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  index === currentImageIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
                }`}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                animate={
                  index === currentImageIndex
                    ? {
                        boxShadow: [
                          "0 0 0 0 rgba(255,255,255,0.7)",
                          "0 0 0 10px rgba(255,255,255,0)",
                          "0 0 0 0 rgba(255,255,255,0)",
                        ],
                      }
                    : {}
                }
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              />
            ))}
          </div>
        </div>
      </div>*/}

      {/* Enhanced Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 right-8 z-20"
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        <div className="flex flex-col items-center text-white/70">
          <motion.span
            className="text-sm mb-3 rotate-90 origin-center"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            Scroll
          </motion.span>
          <div className="w-px h-16 bg-gradient-to-b from-white/70 to-transparent" />
          <motion.div
            className="w-2 h-2 bg-white/70 rounded-full mt-2"
            animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          />
        </div>
      </motion.div>
    </section>
  )
}
