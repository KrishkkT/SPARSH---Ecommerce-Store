"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { ArrowLeft, Phone, Mail, MapPin, Facebook, Instagram, AlertCircle } from "lucide-react"
import { EmailService } from "@/components/email-service"

export default function ContactPage() {
  const router = useRouter()
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" })
  const [contactError, setContactError] = useState("")
  const [isContactSubmitting, setIsContactSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setContactError("")
    setIsContactSubmitting(true)

    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setContactError("Please fill in all required fields")
      setIsContactSubmitting(false)
      return
    }

    try {
      await EmailService.sendContactMessage(contactForm)
      setContactForm({ name: "", email: "", message: "" })
      setSuccessMessage("Your message has been sent successfully!")
      setTimeout(() => setSuccessMessage(""), 5000)
    } catch (error) {
      setContactError("An error occurred. Please try again.")
    } finally {
      setIsContactSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <div className="container mx-auto px-4 py-8">
        <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.3 }}>
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button variant="ghost" onClick={() => router.back()} className="mr-4 hover:bg-emerald-100 rounded-xl">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <motion.h1
              className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Contact Us
            </motion.h1>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Success Message */}
            {successMessage && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                <Alert className="border-emerald-200 bg-emerald-50 rounded-xl">
                  <AlertCircle className="h-4 w-4 text-emerald-600" />
                  <AlertDescription className="text-emerald-800">{successMessage}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, staggerChildren: 0.1 }}
            >
              {/* Contact Form */}
              <motion.div variants={itemVariants}>
                <Card className="p-6 bg-white/95 backdrop-blur-md shadow-lg border border-emerald-100 rounded-2xl">
                  <CardContent>
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      {contactError && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{contactError}</AlertDescription>
                        </Alert>
                      )}
                      <div>
                        <Label htmlFor="contact-name">Name</Label>
                        <Input
                          id="contact-name"
                          type="text"
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          className="bg-white/80 backdrop-blur-sm border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact-email">Email</Label>
                        <Input
                          id="contact-email"
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          className="bg-white/80 backdrop-blur-sm border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact-message">Message</Label>
                        <Textarea
                          id="contact-message"
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          className="bg-white/80 backdrop-blur-sm border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl"
                          rows={4}
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={isContactSubmitting}
                        className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl"
                      >
                        {isContactSubmitting ? (
                          <div className="flex items-center justify-center">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                              className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mr-2"
                            />
                            Sending...
                          </div>
                        ) : (
                          "Send Message"
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Contact Information */}
              <motion.div variants={itemVariants} className="space-y-6">
                <Card className="p-6 bg-white/95 backdrop-blur-md shadow-lg border border-emerald-100 rounded-2xl hover:scale-105 transition-transform duration-300">
                  <CardContent className="flex items-center space-x-4">
                    <Phone className="w-6 h-6 text-emerald-500" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Phone</h3>
                      <p className="text-gray-600">+91 9409073136</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-6 bg-white/95 backdrop-blur-md shadow-lg border border-emerald-100 rounded-2xl hover:scale-105 transition-transform duration-300">
                  <CardContent className="flex items-center space-x-4">
                    <Mail className="w-6 h-6 text-emerald-500" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Email</h3>
                      <p className="text-gray-600">rs.sparshnaturals@gmail.com</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-6 bg-white/95 backdrop-blur-md shadow-lg border border-emerald-100 rounded-2xl hover:scale-105 transition-transform duration-300">
                  <CardContent className="flex items-center space-x-4">
                    <MapPin className="w-6 h-6 text-emerald-500" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Address</h3>
                      <p className="text-gray-600">Bhavnagar, Gujarat</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Map Placeholder */}
                <motion.div
                  className="relative h-48 bg-gray-100 rounded-2xl overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full"
                    />
                  </div>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.8137579850643!2d-74.005941!3d40.712776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDQyJzQ2LjAiTiA3NMKwMDAnMTYuMCJX!5e0!3m2!1sen!2sin!4v1618307734111!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    allowFullScreen
                    loading="lazy"
                    className="absolute inset-0 border-0"
                  />
                </motion.div>

                {/* Social Links */}
                <div className="flex space-x-4">
                  <motion.a
                    href="#"
                    className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg hover:scale-110 transition-transform duration-300"
                    whileTap={{ scale: 0.9 }}
                  >
                    <Facebook className="w-6 h-6" />
                  </motion.a>
                  <motion.a
                    href="#"
                    className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg hover:scale-110 transition-transform duration-300"
                    whileTap={{ scale: 0.9 }}
                  >
                    <Instagram className="w-6 h-6" />
                  </motion.a>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
