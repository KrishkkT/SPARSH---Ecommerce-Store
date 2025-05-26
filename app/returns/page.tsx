"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { ArrowLeft, ChevronDown, ChevronUp, AlertCircle } from "lucide-react"

export default function ReturnsPage() {
  const router = useRouter()
  const [policyExpanded, setPolicyExpanded] = useState<number | null>(null)
  const [faqExpanded, setFaqExpanded] = useState<number | null>(null)
  const [returnRequest, setReturnRequest] = useState({ orderId: "", reason: "", items: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderError, setOrderError] = useState("")
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

  const togglePolicy = (index: number) => {
    setPolicyExpanded((prev) => (prev === index ? null : index))
  }

  const toggleFaq = (index: number) => {
    setFaqExpanded((prev) => (prev === index ? null : index))
  }

  const handleReturnRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setOrderError("")

    if (!returnRequest.orderId || !returnRequest.reason || !returnRequest.items) {
      setOrderError("Please fill in all required fields")
      setIsSubmitting(false)
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Reset form
      setReturnRequest({ orderId: "", reason: "", items: "" })
      setSuccessMessage("Your return request has been submitted successfully!")
      setTimeout(() => setSuccessMessage(""), 5000)
    } catch (error) {
      setOrderError("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const policyData = [
    {
      title: "Eligibility",
      content:
        "To be eligible for a return, items must be unused, in their original packaging, and returned within 30 days of purchase.",
    },
    {
      title: "Process",
      content:
        "To initiate a return, please fill out the return request form below. Once approved, you will receive instructions on how to return your item.",
    },
    {
      title: "Refunds",
      content:
        "Refunds will be processed within 7-10 business days after we receive your returned item. Refunds will be issued to the original payment method.",
    },
  ]

  const faqData = [
    {
      question: "How long do I have to return an item?",
      answer: "You have 30 days from the date of purchase to return an item.",
    },
    {
      question: "What condition does the item need to be in to return it?",
      answer: "Items must be unused, in their original packaging, and in resalable condition.",
    },
    {
      question: "How long does it take to process a refund?",
      answer: "Refunds will be processed within 7-10 business days after we receive your returned item.",
    },
  ]

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
              Returns & Exchanges
            </motion.h1>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Success Message */}
            <AnimatePresence>
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6"
                >
                  <Alert className="border-emerald-200 bg-emerald-50 rounded-xl">
                    <AlertCircle className="h-4 w-4 text-emerald-600" />
                    <AlertDescription className="text-emerald-800">{successMessage}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Return Policy Sections */}
            <motion.div
              className="space-y-6 mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, staggerChildren: 0.1 }}
            >
              {policyData.map((section, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="bg-white/95 backdrop-blur-md shadow-lg border border-emerald-100 rounded-2xl">
                    <div className="p-6 flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-800">{section.title}</h3>
                      <Button variant="ghost" size="icon" onClick={() => togglePolicy(index)}>
                        {policyExpanded === index ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </Button>
                    </div>
                    <AnimatePresence>
                      {policyExpanded === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="p-6 pt-0"
                        >
                          <p className="text-gray-600">{section.content}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Return Request Form */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="bg-white/95 backdrop-blur-md shadow-lg border border-emerald-100 rounded-2xl">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Request a Return</h3>
                  <form onSubmit={handleReturnRequest} className="space-y-4">
                    {orderError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{orderError}</AlertDescription>
                      </Alert>
                    )}
                    <div>
                      <Label htmlFor="return-order-id">Order ID</Label>
                      <Input
                        id="return-order-id"
                        type="text"
                        value={returnRequest.orderId}
                        onChange={(e) => setReturnRequest({ ...returnRequest, orderId: e.target.value })}
                        className="bg-white/80 backdrop-blur-sm border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="return-reason">Reason for Return</Label>
                      <Textarea
                        id="return-reason"
                        value={returnRequest.reason}
                        onChange={(e) => setReturnRequest({ ...returnRequest, reason: e.target.value })}
                        className="bg-white/80 backdrop-blur-sm border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl"
                        rows={3}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="return-items">Items to Return</Label>
                      <Textarea
                        id="return-items"
                        value={returnRequest.items}
                        onChange={(e) => setReturnRequest({ ...returnRequest, items: e.target.value })}
                        className="bg-white/80 backdrop-blur-sm border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl"
                        rows={3}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mr-2"
                          />
                          Submitting...
                        </div>
                      ) : (
                        "Submit Request"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* FAQ Section */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <Card className="bg-white/95 backdrop-blur-md shadow-lg border border-emerald-100 rounded-2xl mt-8">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">Frequently Asked Questions</h3>
                  <div className="space-y-4">
                    {faqData.map((faq, index) => (
                      <div key={index} className="border-b border-emerald-100 pb-4 last:border-b-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-medium text-gray-700">{faq.question}</h4>
                          <Button variant="ghost" size="icon" onClick={() => toggleFaq(index)}>
                            {faqExpanded === index ? (
                              <ChevronUp className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </Button>
                        </div>
                        <AnimatePresence>
                          {faqExpanded === index && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-2 text-gray-600"
                            >
                              {faq.answer}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
