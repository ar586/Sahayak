import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
        <header className="border-b border-border bg-surface/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-white shadow-sm">
                S
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Sahayak
              </span>
            </div>
            <nav className="flex gap-6 items-center">
              <a href="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Subjects</a>
              <a href="/login" className="btn-outline text-sm py-1.5 px-4 block">Login / Add</a>
            </nav>
          </div>
        </header>

        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          {children}
        </main>

        <footer className="border-t border-border mt-auto py-8 text-center text-sm text-slate-400 bg-background">
          <p>© {new Date().getFullYear()} Sahayak. Premium college resources.</p>
        </footer>
      </body>
    </html>
  );
}
