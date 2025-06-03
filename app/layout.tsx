import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ToastProvider } from "@/components/toast-provider"
import { CartProvider } from "@/components/cart-context"

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "SPARSH - Natural Hair Care Products | Premium Organic Hair Solutions",
  description:
    "Transform your hair naturally with SPARSH premium organic hair care products. Handcrafted with love using natural ingredients for healthy, beautiful hair.",
  keywords:
    "natural hair care, organic shampoo, hair growth oil, herbal hair mask, chemical-free hair products, SPARSH",
  authors: [{ name: "SPARSH Natural Hair Care" }],
  creator: "SPARSH Natural Hair Care",
  publisher: "SPARSH Natural Hair Care",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://sparsh-naturals.vercel.app"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/favicon-jW3jsQ6DCkRRuThFj5k8LyDygbf2N7.ico",
        sizes: "any",
      },
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/favicon-16x16-ij0A11RbfwhHAtfcEm8Tp1RQhMKn2z.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/favicon-32x32-w7U3gS4hZNA0oXfI8sQK0IoD5bGjcN.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/apple-touch-icon-LTIf73xzICmdEwRPUCZyKKxvGg1Mjs.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/android-chrome-192x192-KgLlOhdUTlTNmxPDBArWIQknLoU17p.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/android-chrome-512x512-1wYajZyVGFy8xTbadm86nCMpgabRkq.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    title: "SPARSH - Natural Hair Care Products",
    description: "Transform your hair naturally with premium organic hair care products",
    url: "https://sparsh-naturals.vercel.app",
    siteName: "SPARSH Natural Hair Care",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SPARSH Natural Hair Care Products",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SPARSH - Natural Hair Care Products",
    description: "Transform your hair naturally with premium organic hair care products",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          rel="icon"
          href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/favicon-jW3jsQ6DCkRRuThFj5k8LyDygbf2N7.ico"
          sizes="any"
        />
        <link
          rel="icon"
          href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/favicon-16x16-ij0A11RbfwhHAtfcEm8Tp1RQhMKn2z.png"
          sizes="16x16"
          type="image/png"
        />
        <link
          rel="icon"
          href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/favicon-32x32-w7U3gS4hZNA0oXfI8sQK0IoD5bGjcN.png"
          sizes="32x32"
          type="image/png"
        />
        <link
          rel="apple-touch-icon"
          href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/apple-touch-icon-LTIf73xzICmdEwRPUCZyKKxvGg1Mjs.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#059669" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ToastProvider>
          <CartProvider>{children}</CartProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
