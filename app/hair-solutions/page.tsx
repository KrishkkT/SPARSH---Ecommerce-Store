"use client"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { ArrowLeft, Leaf, Droplets, Scissors, Heart, Star, CheckCircle } from "lucide-react"

export default function HairSolutionsPage() {
  const router = useRouter()

  const solutions = [
    {
      id: 1,
      title: "Hair Growth",
      description: "Stimulate natural hair growth with our scientifically formulated treatments",
      icon: Leaf,
      color: "from-emerald-500 to-green-500",
      benefits: [
        "Reduces hair fall by up to 80%",
        "Promotes new hair growth",
        "Strengthens hair follicles",
        "Improves scalp circulation",
      ],
      products: ["Hair Growth Oil", "Scalp Massage Serum", "Growth Boosting Shampoo"],
    },
    {
      id: 2,
      title: "Damage Repair",
      description: "Restore and repair damaged hair with intensive nourishing treatments",
      icon: Heart,
      color: "from-pink-500 to-rose-500",
      benefits: [
        "Repairs split ends and breakage",
        "Restores natural shine",
        "Strengthens hair structure",
        "Protects from future damage",
      ],
      products: ["Keratin Repair Mask", "Protein Treatment", "Damage Control Serum"],
    },
    {
      id: 3,
      title: "Scalp Care",
      description: "Maintain a healthy scalp environment for optimal hair growth",
      icon: Droplets,
      color: "from-blue-500 to-cyan-500",
      benefits: [
        "Removes buildup and toxins",
        "Balances scalp pH",
        "Reduces dandruff and itching",
        "Improves hair texture",
      ],
      products: ["Scalp Detox Treatment", "Anti-Dandruff Shampoo", "Scalp Tonic"],
    },
    {
      id: 4,
      title: "Styling Products",
      description: "Style your hair while nourishing and protecting it naturally",
      icon: Scissors,
      color: "from-purple-500 to-indigo-500",
      benefits: [
        "Long-lasting hold without damage",
        "Adds volume and texture",
        "Protects from heat styling",
        "Easy to wash out",
      ],
      products: ["Volume Boost Mousse", "Heat Protection Spray", "Natural Hold Gel"],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <div className="container mx-auto px-4 py-8">
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
            Hair Solutions
          </motion.h1>
        </div>

        {/* Hero Section */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Comprehensive Hair Care Solutions</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our targeted hair care solutions designed to address specific hair concerns and help you achieve
            your hair goals naturally.
          </p>
        </motion.div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full bg-white/95 backdrop-blur-md shadow-lg border border-emerald-100 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${solution.color} flex items-center justify-center mr-4`}
                    >
                      <solution.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{solution.title}</h3>
                      <p className="text-gray-600">{solution.description}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Key Benefits:</h4>
                    <ul className="space-y-2">
                      {solution.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-emerald-600 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Recommended Products:</h4>
                    <div className="space-y-2">
                      {solution.products.map((product, idx) => (
                        <div key={idx} className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-2" />
                          <span className="text-gray-700">{product}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={() => router.push("/#products")}
                    className={`w-full bg-gradient-to-r ${solution.color} hover:opacity-90 text-white rounded-xl py-3`}
                  >
                    Shop {solution.title} Products
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Hair Care Guide Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/95 backdrop-blur-md shadow-lg border border-emerald-100 rounded-3xl p-8 mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8">
            <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Complete Hair Care Guide
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Assess Your Hair Type</h3>
              <p className="text-gray-600">
                Understanding your hair type and specific concerns is the first step to choosing the right products.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Choose Your Solution</h3>
              <p className="text-gray-600">
                Select from our targeted solutions based on your primary hair concerns and goals.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Follow the Routine</h3>
              <p className="text-gray-600">
                Consistency is key. Follow our recommended routine for best results within 4-6 weeks.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Transform Your Hair?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Start your hair transformation journey today with our natural, effective solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push("/#products")}
              size="lg"
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-8 py-4 rounded-xl"
            >
              Shop All Products
            </Button>
            <Button
              onClick={() => router.push("/contact")}
              variant="outline"
              size="lg"
              className="border-emerald-200 hover:bg-emerald-50 px-8 py-4 rounded-xl"
            >
              Get Hair Consultation
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
