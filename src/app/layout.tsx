import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://oneatlas.vercel.app";
};

const siteUrl = getBaseUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "OneAtlas | AI Model Discovery & Intelligence Platform",
  description:
    "Discover, explore, compare and evaluate frontier and open-source AI models across cloud hosting providers.",
  openGraph: {
    title: "OneAtlas | AI Model Discovery & Intelligence Platform",
    description:
      "Discover, explore, compare and evaluate frontier and open-source AI models across cloud hosting providers.",
    url: siteUrl,
    siteName: "OneAtlas",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "OneAtlas - AI Model Discovery & Intelligence Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OneAtlas | AI Model Discovery & Intelligence Platform",
    description:
      "Discover, explore, compare and evaluate frontier and open-source AI models across cloud hosting providers.",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark`} suppressHydrationWarning>
      <body className="min-h-screen min-h-dvh bg-background font-sans antialiased selection:bg-primary/20 selection:text-primary">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-xl focus:shadow-2xl focus:outline-none font-bold text-sm transition-all"
        >
          Skip to main content
        </a>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
