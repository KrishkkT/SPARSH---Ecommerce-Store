"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, ShoppingCart, Plus, Minus, Check, Star, Leaf } from "lucide-react"
import Product3DViewer from "@/components/product-3d-viewer"
import { ScrollAnimation } from "@/components/scroll-animation"

// Mock product data - in a real app, this would come from your database
const products = [
  {
    id: 1,
    name: "Shampoo",
    price: 300,
    originalPrice: 599,
    image:
      "https://images.unsplash.com/photo-1748104313760-d051ffd69541?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8OXx8fGVufDB8fHx8fA%3D%3D",
    description: "Premium argan oil serum for deep nourishment and shine",
    benefits: ["Reduces frizz", "Adds shine", "Nourishes scalp"],
    ingredients: ["Argan Oil", "Vitamin E", "Jojoba Oil"],
    inStock: true,
    featured: false,
    category: "Hair Care",
    longDescription:
      "Our premium shampoo is formulated with natural ingredients to cleanse your hair without stripping it of its natural oils. The argan oil provides deep nourishment while the vitamin E protects your hair from environmental damage. Regular use will result in softer, shinier, and healthier hair.",
    usage:
      "Apply to wet hair, massage gently into scalp and hair, then rinse thoroughly. For best results, follow with our conditioner.",
    reviews: [
      { id: 1, user: "Priya S.", rating: 5, comment: "Amazing product! My hair feels so soft and manageable." },
      {
        id: 2,
        user: "Rahul M.",
        rating: 4,
        comment: "Good shampoo, noticed less hair fall after using it for a month.",
      },
      { id: 3, user: "Ananya K.", rating: 5, comment: "Love the natural ingredients and the subtle fragrance." },
    ],
  },
  // Other products would be here
]

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("description")
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    // In a real app, fetch from API
    const productId = Number(params.id)
    const foundProduct = products.find((p) => p.id === productId)

    if (foundProduct) {
      setProduct(foundProduct)
    } else {
      // Product not found, redirect to products page
      router.push("/#products")
    }

    setLoading(false)
  }, [params.id, router])

  const handleAddToCart = () => {
    // In a real app, this would add to cart state or call an API
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-12 h-12 border-3 border-emerald-600 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (!product) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-6 hover:bg-emerald-100">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Button>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image/3D Model */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl overflow-hidden shadow-xl"
          >
            <Product3DViewer
              modelUrl="/models/bottle.glb"
              scale={2.5}
              position={[0, -1, 0]}
              backgroundColor="rgba(255, 255, 255, 0.8)"
            />
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Badge className="bg-emerald-100 text-emerald-700 mb-2">{product.category}</Badge>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">{product.name}</h1>

            <div className="flex items-center mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${star <= 4.5 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="ml-2 text-gray-600">(4.5) · 24 reviews</span>
            </div>

            <p className="text-gray-600 mb-6">{product.description}</p>

            <div className="flex items-center mb-6">
              <span className="text-3xl font-bold text-emerald-600 mr-3">₹{product.price.toLocaleString()}</span>
              <span className="text-xl text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
              <Badge className="ml-3 bg-emerald-600 text-white">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </Badge>
            </div>

            <div className="flex items-center mb-8">
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden mr-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  className="rounded-none h-10"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  className="rounded-none h-10"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <Button
                onClick={handleAddToCart}
                className={`flex-1 bg-gradient-to-r ${
                  addedToCart
                    ? "from-emerald-700 to-green-700"
                    : "from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                } text-white py-6 rounded-xl transition-all duration-300`}
              >
                {addedToCart ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-md mb-6">
              <div className="flex items-center text-emerald-600 mb-2">
                <Leaf className="w-5 h-5 mr-2" />
                <span className="font-semibold">Natural Ingredients</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ingredient, index) => (
                  <Badge key={index} variant="outline" className="bg-emerald-50 border-emerald-200">
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-md">
              <h3 className="font-semibold text-gray-800 mb-2">Key Benefits</h3>
              <ul className="space-y-2">
                {product.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="w-4 h-4 text-emerald-600 mr-2" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Product Details Tabs */}
        <ScrollAnimation direction="up">
          <Card className="bg-white/90 backdrop-blur-md shadow-xl border-0 rounded-3xl overflow-hidden mb-12">
            <CardContent className="p-6">
              <Tabs defaultValue="description" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="usage">How to Use</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="p-4">
                  <h3 className="text-xl font-semibold mb-4">Product Description</h3>
                  <p className="text-gray-700 leading-relaxed">{product.longDescription}</p>

                  <h4 className="text-lg font-semibold mt-6 mb-3">Ingredients</h4>
                  <p className="text-gray-700">Our products are made with carefully selected natural ingredients:</p>
                  <ul className="mt-3 space-y-2">
                    {product.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start">
                        <Leaf className="w-5 h-5 text-emerald-600 mr-2 mt-0.5" />
                        <div>
                          <span className="font-medium">{ingredient}</span>
                          <p className="text-sm text-gray-600">
                            {ingredient === "Argan Oil" &&
                              "Rich in vitamin E and fatty acids, helps moisturize hair and reduce frizz."}
                            {ingredient === "Vitamin E" &&
                              "Powerful antioxidant that helps repair damaged hair and protect from environmental damage."}
                            {ingredient === "Jojoba Oil" &&
                              "Similar to natural hair oils, helps balance oil production and nourish the scalp."}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
                <TabsContent value="usage" className="p-4">
                  <h3 className="text-xl font-semibold mb-4">How to Use</h3>
                  <p className="text-gray-700 leading-relaxed mb-6">{product.usage}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      {
                        step: 1,
                        title: "Apply to wet hair",
                        description: "Use a small amount on wet hair after showering",
                      },
                      { step: 2, title: "Massage gently", description: "Work into a lather, focusing on the scalp" },
                      { step: 3, title: "Rinse thoroughly", description: "Rinse completely with warm water" },
                    ].map((step) => (
                      <div key={step.step} className="bg-emerald-50 p-4 rounded-xl">
                        <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center mb-3">
                          {step.step}
                        </div>
                        <h4 className="font-semibold mb-2">{step.title}</h4>
                        <p className="text-sm text-gray-600">{step.description}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="reviews" className="p-4">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Customer Reviews</h3>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Write a Review</Button>
                  </div>

                  <div className="space-y-6">
                    {product.reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-6">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{review.user}</h4>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </ScrollAnimation>

        {/* Related Products */}
        <ScrollAnimation direction="up">
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {products.slice(0, 4).map((relatedProduct) => (
              <Card
                key={relatedProduct.id}
                className="bg-white/90 backdrop-blur-md shadow-lg border-0 rounded-2xl overflow-hidden"
              >
                <CardContent className="p-4">
                  <img
                    src={relatedProduct.image || "/placeholder.svg"}
                    alt={relatedProduct.name}
                    className="w-full h-48 object-cover rounded-xl mb-4"
                  />
                  <h3 className="font-semibold mb-2">{relatedProduct.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-600">₹{relatedProduct.price}</span>
                    <Button variant="outline" size="sm" className="border-emerald-200 hover:bg-emerald-50">
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollAnimation>
      </div>
    </div>
  )
}
