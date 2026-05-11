export const dynamic = 'force-dynamic';
export const revalidate = 0;
import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
// @ts-ignore
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "../components/layout/Navbar";
import { ScrollToTop } from "../components/layout/ScrollToTop";
import { Footer } from "../components/layout/Footer";
import { WhatsAppButton } from "../components/ui/WhatsAppButton";
import Script from "next/script";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://elatahualpa.com.ar"),
  title: {
    default: "El Atahualpa | Ropa Gaucha y del Campo Argentina",
    template: "%s | El Atahualpa",
  },
  description:
    "Tienda online especializada en indumentaria gaucha y del campo argentino. Bombachas, camisas, botas, cintos y accesorios de campo. Envíos a todo el país.",
  keywords: [
    "ropa gaucha",
    "indumentaria campo",
    "bombachas de campo",
    "ropa argentina",
    "vestimenta criolla",
    "botas de campo",
    "El Atahualpa",
    "tienda gaucha online",
    "ropa folklore",
    "indumentaria criolla argentina",
  ],
  authors: [{ name: "El Atahualpa" }],
  creator: "El Atahualpa",
  publisher: "El Atahualpa",
  category: "shopping",
  applicationName: "El Atahualpa",
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://elatahualpa.com.ar",
    siteName: "El Atahualpa",
    title: "El Atahualpa | Ropa Gaucha y del Campo Argentina",
    description:
      "Indumentaria gaucha y del campo argentino. Bombachas, camisas, botas y accesorios. Envíos a todo el país.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "El Atahualpa - Ropa Gaucha Argentina",
      },
    ],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/favicon-192x192.png" },
    ],
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  alternates: {
    canonical: "https://elatahualpa.com.ar",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <ScrollToTop />
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <WhatsAppButton
            phoneNumber="5491151213147"
            message="¡Hola El Atahualpa! Me gustaría hacer una consulta sobre los productos."
          />
        </Providers>

        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];

            function gtag(){dataLayer.push(arguments);}

            gtag('js', new Date());

            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}