import type { Metadata } from "next";
import { siteConfig } from "../site-config";

// Route technique conservée pour les anciens liens d’adhésion.
export const metadata: Metadata = {
  title: "Adhésion APIR — Redirection vers HelloAsso",
  description: "Adhérez à l’APIR sur HelloAsso.",
  alternates: { canonical: "/adhesion" },
  robots: { index: false, follow: false },
};

export default function AdhesionRedirect() {
  return (
    <main>
      <meta httpEquiv="refresh" content={`0;url=${siteConfig.helloAssoUrl}`} />
      <p>
        Redirection vers la page d’adhésion APIR sur HelloAsso…{" "}
        <a href={siteConfig.helloAssoUrl}>Continuer vers HelloAsso</a>
      </p>
    </main>
  );
}
