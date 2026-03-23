import type { Metadata } from "next";
import { Crimson_Pro, Lato, Kalam } from "next/font/google";
import "./globals.css";

const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  variable: "--font-crimson",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
  display: "swap",
});

const kalam = Kalam({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-handwritten",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Legal Pilot | Votre entreprise, sans effort",
  description: "Bureau Juridique Digital pour entrepreneurs. Création, comptabilité et modifications de statuts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${crimsonPro.variable} ${lato.variable} ${kalam.variable}`}>
      <body className="font-sans antialiased text-navy">
        {children}
      </body>
    </html>
  );
}
