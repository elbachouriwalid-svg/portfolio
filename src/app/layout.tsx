import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { IndustrialLoader } from "@/components/loader/IndustrialLoader";
import { PageTransition } from "@/components/layout/PageTransition";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Walid El Bachouri — Technicien Électromécanique Industriel",
    template: "%s | Walid El Bachouri",
  },
  description:
    "Plateforme d'identité industrielle numérique de Walid El Bachouri — Technicien Électromécanique Industriel spécialisé en Maintenance, Automatisation et Industrie 4.0.",
  keywords: [
    "technicien électromécanique",
    "maintenance industrielle",
    "automatisation",
    "Industrie 4.0",
    "réseaux industriels",
    "troubleshooting",
    "Walid El Bachouri",
    "Maroc",
  ],
  authors: [{ name: "Walid El Bachouri" }],
  creator: "Walid El Bachouri",
  openGraph: {
    type: "website",
    locale: "fr_MA",
    title: "Walid El Bachouri — Technicien Électromécanique Industriel",
    description:
      "Plateforme d'identité industrielle numérique — Maintenance · Automatisation · Industrie 4.0",
    siteName: "Walid El Bachouri Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Walid El Bachouri — Technicien Électromécanique Industriel",
    description: "Maintenance · Automatisation · Industrie 4.0",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${manrope.variable}`}>
      <head>
        <meta name="theme-color" content="#050D1A" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased">
        <IndustrialLoader />
        <div id="main-content">
          <Navbar />
          <PageTransition>
            <main>{children}</main>
          </PageTransition>
          <Footer />
        </div>
      </body>
    </html>
  );
}
