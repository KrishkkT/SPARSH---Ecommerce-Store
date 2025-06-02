import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SPARSH by R Naturals - Premium Natural Beauty Products",
  description:
    "Discover premium natural skincare and wellness products crafted with the finest organic ingredients from nature's bounty. Experience the power of green beauty with SPARSH.",
  keywords: "natural skincare, organic beauty, green cosmetics, ayurvedic products, natural wellness",
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
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
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
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
