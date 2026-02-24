import { BookOpen, TrendingUp, Clock, ShieldAlert } from "lucide-react";
import Link from "next/link";

interface Course {
  course_id: string;
  course_name: string;
  semester: number;
  department: string;
}

interface Overview {
  overall_difficulty: string;
  time_required: string;
  risk_level: string;
}

interface Subject {
  id: string;
  name: string;
  slug: string;
  course: Course;
  overview: Overview;
  intro: {
    about_subject: string;
  };
}

async function getSubjects(): Promise<Subject[]> {
  const res = await fetch("http://127.0.0.1:8000/subjects", { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function Home() {
  const subjects = await getSubjects();

  return (
    <div className="space-y-16 py-8">
      <section className="text-center py-20 px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white">
          Master Your <span className="text-primary">Syllabus</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Unit-by-unit breakdowns, study strategies, and expert tips for your college courses.
          Stop guessing what to study and start scoring.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="#subjects" className="btn-primary text-lg">
            Browse Subjects
          </Link>
          <Link href="/editor" className="btn-outline text-lg">
            Contribute
          </Link>
        </div>
      </section>

      <section id="subjects" className="space-y-8">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <h2 className="text-3xl font-bold flex items-center gap-3 text-white">
            <BookOpen className="text-primary" /> Available Subjects
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Link key={subject.id} href={`/subjects/${subject.slug}`} className="block group">
              <div className="glass-panel p-6 h-full flex flex-col hover:-translate-y-1 duration-300">
                <div className="flex justify-between items-start mb-4">
                  <span className="badge text-primary bg-primary/10 border-primary/20">Sem {subject.course.semester}</span>
                  <span className="text-xs text-slate-400 font-medium">{subject.course.department}</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors text-white">{subject.name}</h3>
                <p className="text-slate-300 text-[15px] leading-relaxed flex-1 mb-6 line-clamp-3">
                  {subject.intro.about_subject}
                </p>
                <div className="flex gap-4 pt-4 text-sm text-slate-400 capitalize bg-surface-hover/50 -mx-6 -mb-6 px-6 py-4 rounded-b-xl border-t border-border">
                  <div className="flex items-center gap-1.5" title="Difficulty">
                    <TrendingUp size={16} className="text-slate-500" /> {subject.overview.overall_difficulty}
                  </div>
                  <div className="flex items-center gap-1.5" title="Time Required">
                    <Clock size={16} className="text-slate-500" /> {subject.overview.time_required}
                  </div>
                  <div className="flex items-center gap-1.5" title="Risk Level">
                    <ShieldAlert size={16} className={subject.overview.risk_level === 'high' ? 'text-red-400' : 'text-slate-500'} /> {subject.overview.risk_level}
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {subjects.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-500 rounded-xl border border-border border-dashed">
              No subjects available yet. Be the first to add one!
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
