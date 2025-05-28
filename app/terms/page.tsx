"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
  const router = useRouter()

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

  const termsData = [
    {
      title: "1. Acceptance of Terms",
      content:
        "By accessing and using the SPARSH by R Naturals website, you accept and agree to be bound by the terms and provision of this agreement.",
    },
    {
      title: "2. Use License",
      content:
        " No Permission is granted to temporarily download a copy of the materials on SPARSH's website for personal, non-commercial transitory. Under this license you may not: modify or copy the materials; use the materials for any commercial purpose or for any public display; attempt to reverse engineer any software contained on the website; or remove any copyright or other proprietary notations from the materials.",
    },
    {
      title: "3. Disclaimer",
      content:
        "The materials on SPARSH's website are provided on an 'as is' basis. SPARSH makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.",
    },
    {
      title: "4. Limitations",
      content:
        "In no event shall SPARSH or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on SPARSH's website, even if SPARSH or an authorized representative has been notified orally or in writing of the possibility of such damage.",
    },
    {
      title: "5. Privacy Policy",
      content:
        "Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our service. By using our service, you agree to the collection and use of information in accordance with our Privacy Policy.",
    },
    {
      title: "6. Product Information",
      content:
        "We strive to provide accurate product information, including ingredients, benefits, and usage instructions. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free. All products are subject to availability.",
    },
    {
      title: "7. Pricing and Payment",
      content:
        "All prices are listed in Indian Rupees (INR) and are subject to change without notice. Payment must be received in full before products are shipped. We accept various payment methods as indicated on our website.",
    },
    {
      title: "8. Shipping and Delivery",
      content:
        "We will make every effort to deliver products within the estimated timeframe. However, delivery times are estimates and not guaranteed. Risk of loss and title for products pass to you upon delivery to the carrier.",
    },
    {
      title: "9. User Accounts",
      content:
        "When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account.",
    },
    {
      title: "10. Prohibited Uses",
      content:
        "You may not use our service: for any unlawful purpose or to solicit others to perform unlawful acts; to violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances; to infringe upon or violate our intellectual property rights or the intellectual property rights of others; to harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate; to submit false or misleading information.",
    },
    {
      title: "11. Termination",
      content:
        "We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.",
    },
    {
      title: "12. Governing Law",
      content:
        "These Terms shall be interpreted and governed by the laws of India. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts of Gujarat, India.",
    },
    {
      title: "13. Changes to Terms",
      content:
        "We reserve the right, at our sole discretion, to modify or replace these Terms at any time.",
    },
    {
      title: "14. Contact Information",
      content:
        "If you have any questions about these Terms & Conditions, please contact us at rs.sparshnaturals@gmail.com or call us at +91 9409073136.",
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
              Terms & Conditions
            </motion.h1>
          </div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, staggerChildren: 0.1 }}
            >
              {termsData.map((section, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white/95 backdrop-blur-md shadow-lg border border-emerald-100 rounded-2xl p-6"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">{section.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{section.content}</p>
                </motion.div>
              ))}

              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 border border-emerald-200 rounded-2xl p-6 text-center"
              >
                <p className="text-gray-700 font-medium">Last updated: January 2025</p>
                <p className="text-gray-600 mt-2">
                  For any questions regarding these terms, please contact us at{" "}
                  <Button
                    variant="link"
                    onClick={() => router.push("/contact")}
                    className="text-emerald-600 hover:text-emerald-700 p-0"
                  >
                    rs.sparshnaturals@gmail.com
                  </Button>
                </p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
