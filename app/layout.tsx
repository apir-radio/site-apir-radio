import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "../.vinext/fonts/geist-8ac0455e797f/geist-98bbbccb.woff2",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "../.vinext/fonts/geist-mono-00e989178794/geist-mono-013b2f2f.woff2",
  variable: "--font-geist-mono",
});

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.apir-radio.fr"),
  title: "APIR — Internes en radiologie d’Île-de-France",
  description: "L’Association Parisienne des Internes en Radiologie organise des soirées de formation, rassemble les internes et relaie les offres de postes hospitaliers en Île-de-France.",
  keywords: [
    "APIR",
    "internes en radiologie",
    "radiologie Île-de-France",
    "formation radiologie",
    "soirées de formation radiologie",
    "postes hospitaliers radiologie",
  ],
  authors: [{ name: "Association Parisienne des Internes en Radiologie", url: "https://www.apir-radio.fr" }],
  creator: "Association Parisienne des Internes en Radiologie",
  publisher: "Association Parisienne des Internes en Radiologie",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    siteName: "APIR",
    title: "APIR — Internes en radiologie d’Île-de-France",
    description: "Formations, vie associative et offres de postes hospitaliers pour les internes en radiologie d’Île-de-France.",
    images: [{ url: "/apir-logo.webp", width: 900, height: 959, alt: "Logo de l’Association Parisienne des Internes en Radiologie" }],
  },
  twitter: {
    card: "summary",
    title: "APIR — Internes en radiologie d’Île-de-France",
    description: "Formations, vie associative et offres de postes hospitaliers pour les internes en radiologie d’Île-de-France.",
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
  other: { "codex-preview": "development" },
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
