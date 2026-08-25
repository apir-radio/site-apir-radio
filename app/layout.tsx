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
  title: "APIR — Association Parisienne des Internes en Radiologie",
  description: "L’APIR organise des formations et rassemble les internes en radiologie d’Île-de-France depuis 1998.",
  alternates: { canonical: "/" },
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
