import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { METADATA_BASE_TITLE, BASE_URL } from "@/constants";


import "./globals.css";

const interFont = Inter({
  variable: "--font-inter",
  weight:['400', '600'],
  subsets: ["latin"],

});

export const generateMetadata = async (): Promise<Metadata> => {

  return {
    metadataBase: BASE_URL,
    title: {
      default: METADATA_BASE_TITLE,
      template: `%s | ${METADATA_BASE_TITLE}`,
    },
    description: `Simple game -${METADATA_BASE_TITLE}`,
    openGraph: {
      title: METADATA_BASE_TITLE,
      description: `Simple game - ${METADATA_BASE_TITLE}`,
      url: BASE_URL,
      siteName: METADATA_BASE_TITLE,
      images: [
        {
          url: '/og-image.png',
          width: 196,
          height: 155,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: "summary_large_image",
      title: METADATA_BASE_TITLE,
      description: `Simple game - ${METADATA_BASE_TITLE}`,
      images: ["/og-image.png"],
    },
    robots: {
      index: true,
      follow: true
    }
  }
}

export const viewport: Viewport = {
  themeColor: '#FF8B37',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${interFont.className} ${interFont.variable} antialiased min-h-screen flex bg-theme-base-1`}>
        
        {children}

      </body>
    </html>
  );
}
