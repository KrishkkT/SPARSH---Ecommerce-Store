"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react"
import { PageTransition } from "@/components/page-transition"
import { ScrollAnimation } from "@/components/scroll-animation"
import { InteractiveCard } from "@/components/interactive-card"
import { FloatingElements } from "@/components/floating-elements"
import { MorphingBackground } from "@/components/morphing-background"
import { LoadingAnimation } from "@/components/loading-animation"
import { useToast } from "@/components/toast-provider"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      addToast({
        type: "success",
        title: "Message Sent Successfully!",
        description: "We'll get back to you within 24 hours.",
        duration: 5000,
      })

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      addToast({
        type: "error",
        title: "Failed to Send Message",
        description: "Please try again later or contact us directly.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Us",
      details: ["SPARSH Natural Hair Care", "Bhavnagar, Gujarat", "India"],
      color: "from-emerald-400 to-green-500",
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["+91 9409073136", "Mon - Sat: 9AM - 7PM", "Sunday: 10AM - 5PM"],
      color: "from-blue-400 to-cyan-500",
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["rs.sparshnaturals@gmail.com", "Support within 24 hours", "Quick response guaranteed"],
      color: "from-purple-400 to-pink-500",
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Monday - Friday: 9AM - 7PM", "Saturday: 9AM - 6PM", "Sunday: 10AM - 5PM"],
      color: "from-orange-400 to-red-500",
    },
  ]

  return (
    <PageTransition>
      <div className="min-h-screen relative">
        <MorphingBackground />
        <FloatingElements />

        <div className="relative z-10 bg-gradient-to-br from-emerald-50/80 to-green-100/80 backdrop-blur-sm min-h-screen">
          <div className="container mx-auto px-4 py-16">
            {/* Header */}
            <ScrollAnimation direction="up" className="text-center mb-16">
              <motion.h1
                className="text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  Get in Touch
                </span>
              </motion.h1>
              <motion.p
                className="text-xl text-gray-600 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Have questions about our natural hair care products? We'd love to hear from you! Our team is here to
                help you on your hair transformation journey.
              </motion.p>
            </ScrollAnimation>

            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {contactInfo.map((info, index) => (
                <ScrollAnimation
                  key={index}
                  direction={index % 2 === 0 ? "up" : "down"}
                  delay={index * 0.1}
                  className="h-full"
                >
                  <InteractiveCard className="h-full" glowColor="emerald" intensity={0.15}>
                    <Card className="h-full bg-white/90 backdrop-blur-md border-0 shadow-xl rounded-3xl">
                      <CardContent className="p-6 text-center">
                        <motion.div
                          className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${info.color} flex items-center justify-center shadow-lg`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <info.icon className="w-8 h-8 text-white" />
                        </motion.div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">{info.title}</h3>
                        <div className="space-y-1">
                          {info.details.map((detail, idx) => (
                            <p key={idx} className="text-gray-600 text-sm">
                              {detail}
                            </p>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </InteractiveCard>
                </ScrollAnimation>
              ))}
            </div>

            {/* Contact Form */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Form */}
              <ScrollAnimation direction="left" delay={0.3}>
                <InteractiveCard glowColor="emerald" intensity={0.2}>
                  <Card className="bg-white/90 backdrop-blur-md border-0 shadow-2xl rounded-3xl">
                    <CardHeader className="pb-6">
                      <CardTitle className="text-2xl font-bold text-emerald-800">Send us a Message</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                            <Input
                              type="text"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="border-emerald-200 focus:border-emerald-400 rounded-xl"
                              required
                              placeholder="Your full name"
                            />
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                            <Input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className="border-emerald-200 focus:border-emerald-400 rounded-xl"
                              placeholder="Your phone number"
                            />
                          </motion.div>
                        </div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                          <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="border-emerald-200 focus:border-emerald-400 rounded-xl"
                            required
                            placeholder="your.email@example.com"
                          />
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                          <Input
                            type="text"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            className="border-emerald-200 focus:border-emerald-400 rounded-xl"
                            required
                            placeholder="What's this about?"
                          />
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                          <Textarea
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="border-emerald-200 focus:border-emerald-400 rounded-xl min-h-[120px]"
                            required
                            placeholder="Tell us how we can help you..."
                          />
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            {isSubmitting ? (
                              <div className="flex items-center justify-center">
                                <LoadingAnimation size="sm" color="white" />
                                <span className="ml-2">Sending Message...</span>
                              </div>
                            ) : (
                              <>
                                <Send className="w-5 h-5 mr-2" />
                                Send Message
                              </>
                            )}
                          </Button>
                        </motion.div>
                      </form>
                    </CardContent>
                  </Card>
                </InteractiveCard>
              </ScrollAnimation>

              {/* Additional Info */}
              <ScrollAnimation direction="right" delay={0.4}>
                <div className="space-y-8">
                  <InteractiveCard glowColor="emerald" intensity={0.15}>
                    <Card className="bg-white/90 backdrop-blur-md border-0 shadow-xl rounded-3xl">
                      <CardContent className="p-8">
                        <h3 className="text-2xl font-bold text-emerald-800 mb-4">Why Choose SPARSH?</h3>
                        <div className="space-y-4">
                          {[
                            "100% Natural & Organic Ingredients",
                            "Handcrafted with Traditional Methods",
                            "Scientifically Tested Formulations",
                            "Cruelty-Free & Eco-Friendly",
                            "Personalized Hair Care Solutions",
                          ].map((feature, index) => (
                            <motion.div
                              key={index}
                              className="flex items-center"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 * index }}
                            >
                              <CheckCircle className="w-5 h-5 text-emerald-600 mr-3 flex-shrink-0" />
                              <span className="text-gray-700">{feature}</span>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </InteractiveCard>

                  <InteractiveCard glowColor="blue" intensity={0.15}>
                    <Card className="bg-white/90 backdrop-blur-md border-0 shadow-xl rounded-3xl">
                      <CardContent className="p-8">
                        <h3 className="text-2xl font-bold text-blue-800 mb-4">Quick Support</h3>
                        <p className="text-gray-600 mb-4">
                          Need immediate assistance? Our customer support team is available to help you with:
                        </p>
                        <ul className="space-y-2 text-gray-600">
                          <li>• Product recommendations</li>
                          <li>• Order tracking & updates</li>
                          <li>• Hair care consultations</li>
                          <li>• Returns & exchanges</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </InteractiveCard>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
