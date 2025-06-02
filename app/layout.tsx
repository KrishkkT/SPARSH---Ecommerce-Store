import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SPARSH by R Naturals - Premium Natural Hair Care Products",
  description:
    "Discover premium natural hair care products crafted with the finest organic ingredients from nature's bounty. Experience the power of Ayurvedic beauty with SPARSH by R Naturals.",
  keywords:
    "natural hair care, organic beauty, ayurvedic hair products, chemical-free hair care, natural wellness, SPARSH, R Naturals, hair growth, scalp care, herbal shampoo, natural conditioner",
  authors: [{ name: "SPARSH by R Naturals" }],
  creator: "SPARSH by R Naturals",
  publisher: "SPARSH by R Naturals",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://sparsh-naturals.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SPARSH by R Naturals - Premium Natural Hair Care Products",
    description:
      "Discover premium natural hair care products crafted with the finest organic ingredients from nature's bounty.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://sparsh-naturals.vercel.app",
    siteName: "SPARSH by R Naturals",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-25%20153324.jpg-qDrf7MrviqlCBrwInTkHjfp523Utgw.png",
        width: 1200,
        height: 630,
        alt: "SPARSH by R Naturals Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SPARSH by R Naturals - Premium Natural Hair Care Products",
    description:
      "Discover premium natural hair care products crafted with the finest organic ingredients from nature's bounty.",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-25%20153324.jpg-qDrf7MrviqlCBrwInTkHjfp523Utgw.png",
    ],
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
  generator: "SPARSH by R Naturals",
  applicationName: "SPARSH Natural Hair Care",
  referrer: "origin-when-cross-origin",
  category: "beauty",
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

        {/* Structured data for organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "SPARSH by R Naturals",
              url: process.env.NEXT_PUBLIC_SITE_URL || "https://sparsh-naturals.vercel.app",
              logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-25%20153324.jpg-qDrf7MrviqlCBrwInTkHjfp523Utgw.png",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+91-9409073136",
                contactType: "customer service",
                email: "rs.sparshnaturals@gmail.com",
                availableLanguage: ["English", "Hindi", "Gujarati"],
              },
              sameAs: ["https://www.facebook.com/sparshnaturals", "https://www.instagram.com/sparshnaturals"],
              description:
                "Premium natural hair care products crafted with the finest organic ingredients from nature's bounty.",
            }),
          }}
        />

        {/* Structured data for website */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              url: process.env.NEXT_PUBLIC_SITE_URL || "https://sparsh-naturals.vercel.app",
              name: "SPARSH by R Naturals",
              description:
                "Premium natural hair care products crafted with the finest organic ingredients from nature's bounty.",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || "https://sparsh-naturals.vercel.app"}/search?q={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
