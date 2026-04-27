import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "ADWYA — Plateforme d'Analyse Pharmaceutique",
  description: "Plateforme d'analyse, structuration et classification des données pharmaceutiques. Ingrédients, principes actifs, formulations et outils IA.",
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
        <div className="app-layout">
          <Sidebar />
          <div className="main-area">
            <Header />
            <main className="page-content">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
