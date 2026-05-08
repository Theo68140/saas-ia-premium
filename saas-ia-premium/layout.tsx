import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Neuraxis AI | Automatisation IA Premium pour PME",
  description:
    "Accélérez vos ventes et vos opérations avec une plateforme d'automatisation IA premium: CRM intelligent, chatbot IA, workflows, leads et reporting en temps réel.",
  keywords: ["SaaS IA", "automatisation IA PME", "CRM IA", "chatbot IA", "workflows IA", "lead generation"],
  metadataBase: new URL("https://neuraxis.ai"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Neuraxis AI | Automatisation IA Premium",
    description: "La plateforme IA haut de gamme pour automatiser et scaler les PME modernes.",
    type: "website",
    url: "https://neuraxis.ai",
    locale: "fr_FR",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="fr">
      <body className="antialiased">
        {gaId ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', { page_path: window.location.pathname });
              `}
            </Script>
          </>
        ) : null}
        {children}
      </body>
    </html>
  );
}
