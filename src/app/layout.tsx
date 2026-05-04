import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ADWYA — Plateforme d'Analyse Pharmaceutique",
  description: "Plateforme d'analyse, structuration et classification des données pharmaceutiques.",
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        {children}
      </body>
    </html>
  );
}
