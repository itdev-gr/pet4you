import type { Metadata } from "next";
import { Commissioner, Noto_Sans } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const display = Commissioner({
  subsets: ["greek", "latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display-family",
});

const body = Noto_Sans({
  subsets: ["greek", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body-family",
});

export const metadata: Metadata = {
  title: {
    default: "pet shop — Ό,τι χρειάζεται ο καλύτερός σου φίλος",
    template: "%s | pet shop",
  },
  description:
    "Τροφές, παιχνίδια, αξεσουάρ και φροντίδα για σκύλους, γάτες, μικρά ζώα, πτηνά, ψάρια και ερπετά. Μαζί, σε κάθε πατούσα.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="el">
      <body className={`${display.variable} ${body.variable} antialiased`}>
        {/* Χωρίς αυτό, η πλοήγηση με πληκτρολόγιο περνάει από ~30 συνδέσμους
            του mega menu πριν φτάσει στο περιεχόμενο. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-card focus:bg-forest focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-white"
        >
          Μετάβαση στο περιεχόμενο
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
