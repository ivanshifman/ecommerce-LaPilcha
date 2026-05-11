export const dynamic = 'force-dynamic';
export const revalidate = 0;

import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import Script from "next/script";
// @ts-ignore
import "./globals.css";

import { Providers } from "./providers";
import { Navbar } from "../components/layout/Navbar";
import { ScrollToTop } from "../components/layout/ScrollToTop";
import { Footer } from "../components/layout/Footer";
import { WhatsAppButton } from "../components/ui/WhatsAppButton";

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