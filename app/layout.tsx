import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RadaR • Expériences culturelles à Paris",
  description:
    "Votre radar sur les événements culturels parisiens, personnalisés selon vos vibes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
