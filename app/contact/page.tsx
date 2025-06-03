"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FaEnvelope, FaMapMarkerAlt, FaPhone } from "react-icons/fa"
import { Button } from "@/components/ui/button"

const ContactPage = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionStatus, setSubmissionStatus] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmissionStatus(null)

    try {
      // Simulate form submission delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate successful submission
      setSubmissionStatus("success")
      setName("")
      setEmail("")
      setMessage("")
    } catch (error) {
      console.error("Form submission error:", error)
      setSubmissionStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    { icon: FaMapMarkerAlt, text: "123 Main Street, Anytown, USA" },
    { icon: FaPhone, text: "+1 (555) 123-4567" },
    { icon: FaEnvelope, text: "info@example.com" },
  ]

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500 to-emerald-500 opacity-30 blur-lg"></div>
      <div className="container mx-auto px-6 py-12 z-10">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="text-4xl font-bold text-center text-gray-800 mb-8"
        >
          Contact Us
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            whileHover={{ y: -5 }}
            className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/20"
          >
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows="5"
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Your Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>
              {submissionStatus === "success" && (
                <div className="text-green-500 mb-4">Thank you! Your message has been sent.</div>
              )}
              {submissionStatus === "error" && (
                <div className="text-red-500 mb-4">
                  Oops! There was an error submitting your message. Please try again.
                </div>
              )}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                animate={{
                  boxShadow: [
                    "0 4px 14px 0 rgba(16, 185, 129, 0.2)",
                    "0 4px 14px 0 rgba(16, 185, 129, 0.4)",
                    "0 4px 14px 0 rgba(16, 185, 129, 0.2)",
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                whileHover={{
                  scale: 1.05,
                  y: -5,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/30"
              >
                <div className="flex items-center space-x-4">
                  <info.icon className="text-2xl text-emerald-600" />
                  <p className="text-gray-700">{info.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
