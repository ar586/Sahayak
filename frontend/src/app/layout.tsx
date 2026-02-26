import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sahayak - College Syllabus Breakdown",
  description: "A premium platform to navigate your college courses unit by unit with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen flex flex-col antialiased bg-background text-foreground`}>
        <Providers>
          <Navbar />
          <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            {children}
          </main>

          <footer className="border-t border-border mt-auto py-8 text-center text-sm text-slate-400 bg-background">
            <p>© {new Date().getFullYear()} Sahayak</p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
