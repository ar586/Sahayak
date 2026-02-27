import type { Metadata } from "next";
import { Newsreader, Public_Sans, Playfair_Display, Noto_Serif } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";
import { Linkedin } from "lucide-react";

const newsreader = Newsreader({ subsets: ["latin"], style: ['normal', 'italic'], variable: '--font-newsreader' });
const publicSans = Public_Sans({ subsets: ["latin"], weight: ['300', '400', '500', '600', '700', '800', '900'], variable: '--font-public-sans' });
const playfair = Playfair_Display({ subsets: ["latin"], style: ['normal', 'italic'], variable: '--font-playfair' });
const notoSerif = Noto_Serif({ subsets: ["latin"], weight: ['400', '700'], variable: '--font-noto-serif' });

export const metadata: Metadata = {
  title: "Sahayak - Master Your Academic Pursuit",
  description: "A curated repository of academic knowledge for the discerning student.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${newsreader.variable} ${publicSans.variable} ${playfair.variable} ${notoSerif.variable} min-h-screen flex flex-col antialiased bg-background text-foreground parchment-texture`}>
        <Providers>
          <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
            <div className="layout-container flex h-full grow flex-col">
              {/* Navbar will go here via Next.js routing tree */}
              <Navbar />

              {children}

              {/* Footer will be rebuilt subsequently */}
              <footer className="border-t border-academic-gold/30 bg-primary text-parchment py-12 mt-auto">
                <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                  <div className="text-center md:text-left flex flex-col justify-center">
                    <h4 className="text-xl font-medium italic mb-2 font-serif text-academic-gold">Sahayak</h4>
                    <p className="text-xs opacity-60 max-w-xs md:max-w-full">A curated repository of academic knowledge for the discerning student.</p>
                  </div>
                  <div className="text-sm italic opacity-50 font-serif flex justify-center items-center h-full">
                    <span>© 2026 Sahayak</span>
                  </div>
                  <div className="text-sm italic opacity-50 font-serif flex justify-center md:justify-end items-center h-full">
                    <span className="flex items-center gap-1.5 group">
                      Made by
                      <a href="https://www.linkedin.com/in/aryan-anand-4aba06309/" target="_blank" rel="noopener noreferrer" className="underline group-hover:text-academic-gold transition-colors flex items-center gap-1.5">
                        Aryan Anand <Linkedin size={16} className="inline-block relative -top-[1px]" />
                      </a>
                    </span>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
