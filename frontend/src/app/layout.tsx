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
      <body className={`${newsreader.variable} ${publicSans.variable} ${playfair.variable} ${notoSerif.variable} min-h-screen flex flex-col antialiased bg-background text-foreground parchment-texture print:block print:bg-white`}>
        <Providers>
          <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden print:block print:overflow-visible">
            <div className="layout-container flex h-full grow flex-col print:block">
              {/* Navbar will go here via Next.js routing tree */}
              <Navbar />

              {children}

              {/* Footer will be rebuilt subsequently */}
              <footer className="border-t border-academic-gold/30 bg-primary text-parchment py-8 mt-auto">
                <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="flex justify-center md:justify-start">
                    <img src="/logo-footer.png" alt="Sahayak Logo" className="h-12 md:h-16 w-auto object-contain" />
                  </div>
                  <div className="flex justify-center">
                    <span className="text-sm italic opacity-50 font-serif whitespace-nowrap">© 2026 Sahayak</span>
                  </div>
                  <div className="flex justify-center md:justify-end">
                    <span className="text-sm italic opacity-50 font-serif flex items-center gap-1.5 group whitespace-nowrap">
                      Made by
                      <a href="https://www.linkedin.com/in/aryan-anand-4aba06309/" target="_blank" rel="noopener noreferrer" className="group-hover:text-academic-gold transition-colors flex items-center gap-1.5">
                        Aryan Anand <Linkedin size={20} className="inline-block relative -top-[1px]" />
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
