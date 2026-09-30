import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/sections/Footer";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "UTM Quantum Community | Universiti Teknologi Malaysia",
  description: "UTM Quantum Community connects researchers, students and collaborators exploring quantum science and emerging quantum technologies.",
  openGraph: {
    title: "UTM Quantum Community",
    description: "UTM Quantum Community connects researchers, students and collaborators exploring quantum science and emerging quantum technologies.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${spaceGrotesk.variable} font-sans antialiased bg-black-deep text-off-white selection:bg-utm-maroon selection:text-white`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
