import type { Metadata, Viewport } from "next"
import Script from "next/script"
import "./globals.css"
import PaletteEngine from "@/components/PaletteEngine"
import GlobeLayer from "@/components/GlobeLayer"
import CursorGlow from "@/components/CursorGlow"
import ScrollProgress from "@/components/ScrollProgress"
import Loader from "@/components/Loader"
import { SITE_URL, site } from "@/lib/content"
import { siteJsonLd } from "@/lib/seo"
import { themeInitScript } from "@/lib/theme"

const title = `MT — ${site.name} | ${site.jobTitle}`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: `%s | MT — ${site.name}` },
  description: site.description,
  keywords: site.keywords,
  authors: [{ name: site.name, url: SITE_URL }],
  creator: site.name,
  publisher: site.name,
  applicationName: `MT — ${site.name}`,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: `MT — ${site.name}`,
    title,
    description: site.description,
    locale: "en_US",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: `${site.name} — ${site.jobTitle}` }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@moniruzzaman_24",
    creator: "@moniruzzaman_24",
    title,
    description: site.description,
    images: ["/og-image.jpg"],
  },
  verification: { google: site.googleVerification },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
  category: "technology",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f6fc" },
    { media: "(prefers-color-scheme: dark)", color: "#05060a" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-sans antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }} />
        <PaletteEngine />
        <div className="aurora" aria-hidden>
          <span /><span /><span />
        </div>
        <div className="grid-overlay" aria-hidden />
        <GlobeLayer />
        <CursorGlow />
        <ScrollProgress />
        <Loader />
        {children}

        {/* Google Analytics */}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${site.gaId}`} strategy="afterInteractive" />
        <Script id="ga-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${site.gaId}');`}
        </Script>
      </body>
    </html>
  )
}
