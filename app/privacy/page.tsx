"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
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

  const privacyData = [
    {
      title: "1. Information We Collect",
      content:
        "We collect information you provide directly to us, such as when you create an account, make a purchase, subscribe to our newsletter, or contact us. This may include your name, email address, phone number, shipping address, payment information, and any other information you choose to provide.",
    },
    {
      title: "2. How We Use Your Information",
      content:
        "We use the information we collect to: provide, maintain, and improve our services; process transactions and send related information; send you technical notices, updates, security alerts, and support messages; respond to your comments, questions, and customer service requests; communicate with you about products, services, offers, and events; monitor and analyze trends, usage, and activities in connection with our services.",
    },
    {
      title: "3. Information Sharing and Disclosure",
      content:
        "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share your information with: service providers who assist us in operating our website and conducting our business; when required by law or to protect our rights; in connection with a business transfer or acquisition.",
    },
    {
      title: "4. Data Security",
      content:
        "We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.",
    },
    {
      title: "5. Cookies and Tracking Technologies",
      content:
        "We use cookies and similar tracking technologies to collect and use personal information about you. Cookies are small data files stored on your device that help us improve our services and your experience. You can control cookies through your browser settings.",
    },
    {
      title: "6. Third-Party Services",
      content:
        "Our website may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to read their privacy policies before providing any information.",
    },
    {
      title: "7. Data Retention",
      content:
        "We retain your personal information for as long as necessary to fulfill the purposes outlined in this privacy policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.",
    },
    {
      title: "8. Your Rights and Choices",
      content:
        "You have the right to: access, update, or delete your personal information; opt out of receiving promotional communications; request that we limit our use of your information; withdraw your consent where we rely on consent to process your information.",
    },
    {
      title: "9. Children's Privacy",
      content:
        "Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.",
    },
    {
      title: "10. International Data Transfers",
      content:
        "Your information may be transferred to and processed in countries other than your own. We will ensure that any such transfers comply with applicable data protection laws and that your information receives adequate protection.",
    },
    {
      title: "11. Changes to This Privacy Policy",
      content:
        "We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the 'Last updated' date. We encourage you to review this policy periodically.",
    },
    {
      title: "12. Contact Us",
      content:
        "If you have any questions about this privacy policy or our privacy practices, please contact us at rs.sparshnaturals@gmail.com or call us at +91 9409073136. You can also write to us at our address in Bhavnagar, Gujarat.",
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
              Privacy Policy
            </motion.h1>
          </div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, staggerChildren: 0.1 }}
            >
              {privacyData.map((section, index) => (
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
                  For privacy-related inquiries, please contact us at{" "}
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
