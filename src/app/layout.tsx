import type { Metadata } from "next";
import { Kdam_Thmor_Pro, Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const kdam = Kdam_Thmor_Pro({
  variable: "--font-kdam",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Movida Deportiva TV",
  description: "Movida Deportiva TV",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${manrope.variable} ${kdam.variable}`}>
        {children}
      </body>
    </html>
  );
}
