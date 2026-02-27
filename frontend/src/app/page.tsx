import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import SubjectGrid from "@/components/SubjectGrid";

interface Course {
  course_id: string;
  course_name: string;
  semester: number;
  department: string;
}

interface Overview {
  overall_difficulty: string;
  nature_type: string;
  time_required: string;
  scoring_potential: string;
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

async function getSubjects(search?: string): Promise<Subject[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const url = search
    ? `${API_URL}/subjects?search=${encodeURIComponent(search)}`
    : `${API_URL}/subjects`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function Home({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const resolvedParams = await searchParams;
  const search = resolvedParams?.search;
  const subjects = await getSubjects(search);

  return (
    <div className="flex-1 flex flex-col text-academic-green">
      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-8 py-24 text-center w-full">
        <div className="mb-4 flex justify-center">
          <div className="h-px w-24 bg-academic-gold self-center"></div>
          <span className="mx-4 text-academic-gold italic uppercase tracking-[0.3em] text-xs font-bold font-sans">The College Syllabus Assistant</span>
          <div className="h-px w-24 bg-academic-gold self-center"></div>
        </div>

        <h1 className="text-6xl md:text-7xl font-light mb-12 italic font-serif">Master Your Academic Pursuit</h1>

        <SearchBar />
      </header>

      {/* Subject Grid */}
      <SubjectGrid subjects={subjects} search={search} />
    </div>
  );
}
