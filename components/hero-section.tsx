"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Leaf, Heart, Star, ArrowRight, ShoppingBag, Award, Zap } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Icons */}
        <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1 }}
        animate={{ scale: 1.05 }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e')", // ✅ Replace with your image path (e.g., public/bg-hero.jpg)
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.5, // subtle and non-distracting
        }}
      />

        <motion.div
          className="absolute top-32 right-16 text-green-300"
          animate={{
            y: [0, 15, 0],
            rotate: [0, -10, 0],
          }}
          transition={{
            duration: 3.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          <Sparkles size={28} />
        </motion.div>

        <motion.div
          className="absolute bottom-32 left-20 text-teal-300"
          animate={{
            y: [0, -25, 0],
            rotate: [0, 15, 0],
          }}
          transition={{
            duration: 4.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <Heart size={30} />
        </motion.div>

        <motion.div
          className="absolute bottom-40 right-12 text-emerald-400"
          animate={{
            y: [0, 20, 0],
            rotate: [0, -15, 0],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1.5,
          }}
        >
          <Star size={26} />
        </motion.div>

        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-emerald-200 to-green-200 rounded-full blur-3xl opacity-30"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-teal-200 to-emerald-200 rounded-full blur-3xl opacity-25"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.25, 0.4, 0.25],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 mt-5"
          >
            <Badge
              variant="secondary"
              className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors duration-300 px-6 py-2 text-sm font-medium"
            >
              <Award className="w-4 h-4 mr-2" />
              100% Natural & Organic
            </Badge>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Transform Your Hair
            <br />
            <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
              Naturally
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Discover the power of nature with our premium organic hair care products. Handcrafted with love using the
            finest natural ingredients.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Shop Now
                <motion.div
                  className="ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white px-8 py-4 text-lg font-semibold transition-all duration-300"
              >
                <Zap className="w-5 h-5 mr-2" />
                Learn More
              </Button>
            </motion.div>
          </motion.div>

          {/* Features Grid 
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto -mt-6"
          >
            {[
              {
                icon: Leaf,
                title: "100% Natural",
                description: "Pure organic ingredients",
              },
              {
                icon: Heart,
                title: "Cruelty Free",
                description: "Never tested on animals",
              },
              {
                icon: Sparkles,
                title: "Proven Results",
                description: "Visible transformation",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                whileHover={{
                  y: -5,
                  transition: { duration: 0.2 },
                }}
                className="text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-emerald-100 hover:border-emerald-200 transition-all duration-300 hover:shadow-lg"
              >
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-100 to-green-100 rounded-full mb-4"
                  whileHover={{
                    scale: 1.1,
                    rotate: 5,
                    transition: { duration: 0.2 },
                  }}
                >
                  <feature.icon className="w-8 h-8 text-emerald-600" />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>*/}
        </div>
      </div>
    </section>
  )
}
