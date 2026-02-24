import { BookOpen, TrendingUp, Clock, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="text-center py-20 px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Syllabus</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
          Unit-by-unit breakdowns, study strategies, and expert tips for your college courses.
          Stop guessing what to study and start scoring.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="#subjects" className="btn-primary text-lg px-8 py-3">
            Browse Subjects
          </Link>
          <Link href="/editor" className="btn-outline text-lg px-8 py-3">
            Contribute
          </Link>
        </div>
      </section>

      <section id="subjects" className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <BookOpen className="text-primary" /> Available Subjects
          </h2>
        </div>

        {/* Temporary static grid before fetching from backend */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Link key={i} href="/subjects/xover" className="block group">
              <div className="glass-panel p-6 h-full flex flex-col hover:-translate-y-1 duration-300">
                <div className="flex justify-between items-start mb-4">
                  <span className="badge border-primary/30 text-primary bg-primary/10">Sem 3</span>
                  <span className="text-xs text-gray-500 font-medium">CSE</span>
                </div>
                <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">Xover</h3>
                <p className="text-gray-400 text-sm flex-1 mb-6">
                  Comprehensive breakdown of CS301 concepts, featuring midsem strategies and unit summaries.
                </p>
                <div className="flex gap-4 border-t border-border pt-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1.5" title="Difficulty">
                    <TrendingUp size={16} /> Moderate
                  </div>
                  <div className="flex items-center gap-1.5" title="Time Required">
                    <Clock size={16} /> High
                  </div>
                  <div className="flex items-center gap-1.5" title="Risk Level">
                    <ShieldAlert size={16} /> Moderate
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
