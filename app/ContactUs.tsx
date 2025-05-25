"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch("https://formspree.io/f/xeogbjvv", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })

    if (response.ok) {
      setSubmitted(true)
      setFormData({ name: "", email: "", message: "" })
    }
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-white to-green-50 py-12 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-10">
        <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">Contact Us</h2>
        {submitted ? (
          <p className="text-green-600 text-center text-lg">Thank you! We'll get back to you soon.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </Label>
              <Input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl border border-gray-300 shadow-sm p-3 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                type="email"
                name="email"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl border border-gray-300 shadow-sm p-3 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <Label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
              </Label>
              <Textarea
                name="message"
                id="message"
                rows={4}
                required
                value={formData.message}
                onChange={handleChange}
                className="mt-1 block w-full rounded-xl border border-gray-300 shadow-sm p-3 focus:ring-green-500 focus:border-green-500"
              ></Textarea>
            </div>

            <div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition"
              >
                Send Message
              </motion.button>
            </div>
          </form>
        )}
      </div>
    </motion.div>
  )
}
