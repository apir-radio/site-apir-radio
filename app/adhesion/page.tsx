import type { Metadata } from "next";

const helloAssoUrl =
  "https://www.helloasso.com/associations/apir-association-parisienne-des-internes-en-radiologie/adhesions/adhesion-apir-2025-2026";

export const metadata: Metadata = {
  title: "Adhésion APIR — Redirection vers HelloAsso",
  description: "Adhérez à l’APIR sur HelloAsso.",
  alternates: { canonical: "/adhesion" },
};

export default function AdhesionRedirect() {
  return (
    <main>
      <meta httpEquiv="refresh" content={`0;url=${helloAssoUrl}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace(${JSON.stringify(helloAssoUrl)});`,
        }}
      />
      <p>
        Redirection vers la page d’adhésion APIR sur HelloAsso…{" "}
        <a href={helloAssoUrl}>Continuer vers HelloAsso</a>
      </p>
    </main>
  );
}
