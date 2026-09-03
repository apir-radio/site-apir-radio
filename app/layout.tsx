import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { basePath, siteConfig } from "./site-config";

const geistSans = localFont({
  src: "./fonts/geist-8ac0455e797f/geist-98bbbccb.woff2",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/geist-mono-00e989178794/geist-mono-013b2f2f.woff2",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: [
    "APIR",
    "internes en radiologie",
    "radiologie Île-de-France",
    "formation radiologie",
    "soirées de formation radiologie",
    "postes hospitaliers radiologie",
  ],
  authors: [{ name: siteConfig.organizationName, url: siteConfig.siteUrl }],
  creator: siteConfig.organizationName,
  publisher: siteConfig.organizationName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    siteName: "APIR",
    title: siteConfig.name,
    description: siteConfig.openGraphDescription,
    images: [{ url: "/apir-logo.webp", width: 900, height: 959, alt: "Logo de l’Association Parisienne des Internes en Radiologie" }],
  },
  twitter: {
    card: "summary",
    title: siteConfig.name,
    description: siteConfig.openGraphDescription,
    images: ["/apir-logo.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: `${basePath}/favicon.png`,
    shortcut: `${basePath}/favicon.png`,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
