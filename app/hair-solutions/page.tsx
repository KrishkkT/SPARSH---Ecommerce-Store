"use client"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { ArrowLeft, Leaf, Droplets, Scissors, Heart, Star, CheckCircle } from "lucide-react"
import { AnimatedPageWrapper } from "@/components/animated-page-wrapper"
import { ScrollAnimation } from "@/components/scroll-animation"
import { InteractiveCard } from "@/components/interactive-card"
import { FloatingElements } from "@/components/floating-elements"
import { MorphingBackground } from "@/components/morphing-background"

export default function HairSolutionsPage() {
  const router = useRouter()

  const solutions = [
    {
      id: 1,
      title: "Hair Growth",
      description: "Stimulate natural hair growth with our scientifically formulated treatments",
      icon: Leaf,
      color: "from-emerald-500 to-green-500",
      bgImage: "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=800&auto=format&fit=crop&q=80",
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
      bgImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
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
      bgImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=80",
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
      bgImage: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&auto=format&fit=crop&q=80",
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
    <AnimatedPageWrapper>
      <div className="min-h-screen relative">
        <MorphingBackground />
        <FloatingElements />

        <div className="relative z-10 bg-gradient-to-br from-emerald-50/80 to-green-100/80 backdrop-blur-sm">
          {/* Header */}
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center mb-8">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  onClick={() => router.back()}
                  className="mr-4 hover:bg-emerald-100 rounded-xl backdrop-blur-sm"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>
              </motion.div>
              <motion.h1
                className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Hair Solutions
              </motion.h1>
            </div>

            {/* Hero Section */}
            <ScrollAnimation direction="up" className="text-center mb-16">
              <motion.h2
                className="text-4xl font-bold text-gray-800 mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Comprehensive Hair Care Solutions
              </motion.h2>
              <motion.p
                className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Discover our targeted hair care solutions designed to address specific hair concerns and help you
                achieve your hair goals naturally. Each product is scientifically formulated with premium natural
                ingredients.
              </motion.p>
            </ScrollAnimation>

            {/* Solutions Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {solutions.map((solution, index) => (
                <ScrollAnimation
                  key={solution.id}
                  direction={index % 2 === 0 ? "left" : "right"}
                  delay={index * 0.2}
                  className="h-full"
                >
                  <InteractiveCard className="h-full" glowColor="emerald" intensity={0.2}>
                    <Card className="h-full bg-white/90 backdrop-blur-md shadow-2xl border-0 rounded-3xl overflow-hidden group">
                      {/* Background Image */}
                      <div className="relative h-48 overflow-hidden">
                        <motion.div
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url(${solution.bgImage})` }}
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 flex items-center">
                          <motion.div
                            className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${solution.color} flex items-center justify-center mr-4 shadow-lg`}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                          >
                            <solution.icon className="w-6 h-6 text-white" />
                          </motion.div>
                          <div>
                            <h3 className="text-2xl font-bold text-white">{solution.title}</h3>
                            <p className="text-white/80">{solution.description}</p>
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-8">
                        <div className="mb-6">
                          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <CheckCircle className="w-5 h-5 text-emerald-600 mr-2" />
                            Key Benefits:
                          </h4>
                          <ul className="space-y-3">
                            {solution.benefits.map((benefit, idx) => (
                              <motion.li
                                key={idx}
                                className="flex items-center"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * idx }}
                              >
                                <CheckCircle className="w-4 h-4 text-emerald-600 mr-3 flex-shrink-0" />
                                <span className="text-gray-700">{benefit}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>

                        <div className="mb-6">
                          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <Star className="w-5 h-5 text-yellow-500 mr-2" />
                            Recommended Products:
                          </h4>
                          <div className="space-y-2">
                            {solution.products.map((product, idx) => (
                              <motion.div
                                key={idx}
                                className="flex items-center p-2 bg-emerald-50 rounded-lg"
                                whileHover={{ scale: 1.02, backgroundColor: "rgba(16, 185, 129, 0.1)" }}
                              >
                                <Star className="w-4 h-4 text-yellow-500 mr-2" />
                                <span className="text-gray-700 font-medium">{product}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            onClick={() => router.push("/#products")}
                            className={`w-full bg-gradient-to-r ${solution.color} hover:opacity-90 text-white rounded-2xl py-3 shadow-lg hover:shadow-xl transition-all duration-300`}
                          >
                            Shop {solution.title} Products
                          </Button>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </InteractiveCard>
                </ScrollAnimation>
              ))}
            </div>

            {/* Hair Care Guide Section */}
            <ScrollAnimation direction="up" delay={0.5}>
              <InteractiveCard className="mb-16" glowColor="emerald" intensity={0.15}>
                <div className="bg-white/90 backdrop-blur-md shadow-2xl border-0 rounded-3xl p-8">
                  <h2 className="text-4xl font-bold text-center mb-8">
                    <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                      Complete Hair Care Guide
                    </span>
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                      {
                        step: "1",
                        title: "Assess Your Hair Type",
                        description:
                          "Understanding your hair type and specific concerns is the first step to choosing the right products.",
                        color: "from-emerald-400 to-green-500",
                      },
                      {
                        step: "2",
                        title: "Choose Your Solution",
                        description:
                          "Select from our targeted solutions based on your primary hair concerns and goals.",
                        color: "from-blue-400 to-cyan-500",
                      },
                      {
                        step: "3",
                        title: "Follow the Routine",
                        description:
                          "Consistency is key. Follow our recommended routine for best results within 4-6 weeks.",
                        color: "from-purple-400 to-pink-500",
                      },
                    ].map((step, index) => (
                      <motion.div
                        key={index}
                        className="text-center"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 * index }}
                      >
                        <motion.div
                          className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <span className="text-2xl font-bold text-white">{step.step}</span>
                        </motion.div>
                        <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{step.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </InteractiveCard>
            </ScrollAnimation>

            {/* CTA Section */}
            <ScrollAnimation direction="up" delay={0.7}>
              <div className="text-center">
                <motion.h2
                  className="text-4xl font-bold text-gray-800 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Ready to Transform Your Hair?
                </motion.h2>
                <motion.p
                  className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Start your hair transformation journey today with our natural, effective solutions backed by science
                  and crafted with love.
                </motion.p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => router.push("/#products")}
                      size="lg"
                      className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Shop All Products
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => router.push("/contact")}
                      variant="outline"
                      size="lg"
                      className="border-emerald-200 hover:bg-emerald-50 px-8 py-4 rounded-2xl backdrop-blur-sm"
                    >
                      Get Hair Consultation
                    </Button>
                  </motion.div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </AnimatedPageWrapper>
  )
}
