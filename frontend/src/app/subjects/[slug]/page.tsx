import { Metadata } from "next";
import { BookOpen, AlertTriangle, ShieldCheck, Target, TrendingUp, Clock, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import ImageModal from "@/components/ImageModal";
import SyllabusButton from "@/components/SyllabusButton";
import ExportPdfButton from "@/components/ExportPdfButton";

interface Unit {
    unit_number: number;
    title: string;
    unit_difficulty: string;
    scoring_value: string;
    topics: string[];
}

interface Material {
    title: string;
    url: string;
    type: "video" | "document" | "link";
}

interface Subject {
    id: string;
    name: string;
    slug: string;
    course: { course_id: string; course_name: string; semester: number; department: string };
    overview: { overall_difficulty: string; nature_type: string; time_required: string; scoring_potential: string; risk_level: string };
    intro: { about_subject: string; general_tips: string; things_to_keep_in_mind: string };
    units: Unit[];
    study_modes: { one_day: string; three_day: string; full_prep: string; nine_plus_mode: string };
    midsem_strategy: string;
    endsem_strategy: string;
    authors?: { user_id: string; display_name: string }[];
    syllabus_image_url?: string;
    midsem_pyq_url?: string;
    endsem_pyq_url?: string;
    materials?: Material[];
}

async function getSubject(slug: string): Promise<Subject | null> {
    console.log("Fetching subject:", slug);
    try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const res = await fetch(`${API_URL}/subjects/${slug}`, { cache: "no-store" });
        console.log("Fetch status:", res.status);
        if (!res.ok) {
            console.error("Failed to fetch:", res.status, res.statusText);
            return null;
        }
        const data = await res.json();
        console.log("Fetched subject ID:", data?.id);
        return data;
    } catch (err) {
        console.error("Fetch error:", err);
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const subject = await getSubject(resolvedParams.slug);
    if (!subject) return { title: "Subject Not Found - Sahayak" };
    return { title: `${subject.name} - Sahayak` };
}

export default async function SubjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    const subject = await getSubject(slug);

    if (!subject) {
        return (
            <div className="text-center py-40">
                <h1 className="text-4xl font-bold mb-4 font-serif italic text-academic-green">Subject Not Found</h1>
                <p className="text-slate-500 font-sans tracking-wide uppercase text-sm">The archive you are looking for does not exist.</p>
            </div>
        );
    }

    return (
        <div className="max-w-[1100px] mx-auto px-4 md:px-8 py-12 text-academic-green">
            {/* MainHeader */}
            <header className="text-center py-12 border-b border-border mb-16">
                <p className="uppercase tracking-widest text-sm mb-4 opacity-70 font-sans font-bold">Sahayak Academic Repository</p>
                <h1 className="text-5xl md:text-6xl font-extrabold mb-6 font-display leading-tight">{subject.name}</h1>
                <div className="flex flex-wrap justify-center items-center gap-4 text-lg italic opacity-80 font-serif mb-6">
                    <span>{subject.course.department}</span>
                    <span className="w-1.5 h-1.5 bg-academic-green rounded-full hidden sm:block"></span>
                    <span>Semester {subject.course.semester}</span>
                    <span className="w-1.5 h-1.5 bg-academic-green rounded-full hidden sm:block"></span>
                    <span>Course Code: {subject.course.course_id}</span>
                </div>
                <div className="flex flex-wrap justify-center items-center gap-4 mt-8">
                    {subject.syllabus_image_url && (
                        <SyllabusButton url={subject.syllabus_image_url} />
                    )}
                    <ExportPdfButton />
                </div>
            </header>

            {/* ScholarlyMetrics */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 print-page-break">
                <div className="encyclopedia-card p-6 text-center rounded-custom shadow-sm flex flex-col justify-center">
                    <h3 className="text-[10px] uppercase tracking-widest font-bold mb-2 opacity-60 font-sans">Difficulty</h3>
                    <p className="text-xl md:text-2xl font-semibold capitalize font-serif">{subject.overview.overall_difficulty}</p>
                </div>
                <div className="encyclopedia-card p-6 text-center rounded-custom shadow-sm flex flex-col justify-center">
                    <h3 className="text-[10px] uppercase tracking-widest font-bold mb-2 opacity-60 font-sans">Time Investment</h3>
                    <p className="text-xl md:text-2xl font-semibold capitalize font-serif">{subject.overview.time_required}</p>
                </div>
                <div className="encyclopedia-card p-6 text-center rounded-custom shadow-sm flex flex-col justify-center">
                    <h3 className="text-[10px] uppercase tracking-widest font-bold mb-2 opacity-60 font-sans">Scoring Potential</h3>
                    <p className="text-xl md:text-2xl font-semibold capitalize font-serif">{subject.overview.scoring_potential}</p>
                </div>
                <div className="encyclopedia-card p-6 text-center rounded-custom shadow-sm flex flex-col justify-center">
                    <h3 className="text-[10px] uppercase tracking-widest font-bold mb-2 opacity-60 font-sans">Primary Type</h3>
                    <p className="text-xl md:text-2xl font-semibold capitalize font-serif">{subject.overview.nature_type}</p>
                </div>
            </section>

            {/* OverviewSection */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20 print:block print-page-break-before print-page-break">
                <div className="lg:col-span-2">
                    <h2 className="text-3xl font-bold mb-8 border-b-2 border-academic-green w-max pr-12 pb-2 font-serif">General Overview</h2>
                    <div className="justified-text text-lg leading-relaxed text-slate-800 font-serif whitespace-pre-line">
                        {subject.intro.about_subject}
                    </div>
                </div>
                <aside className="lg:col-span-1">
                    <div className="bg-academic-parchment p-8 border border-border rounded-custom shadow-inner sticky top-24">
                        <h3 className="text-xl font-bold italic mb-6 text-center font-serif text-academic-gold">Scholarly Advice</h3>
                        <ul className="space-y-6 text-md leading-snug font-serif">
                            <li className="flex gap-3">
                                <span className="font-bold text-academic-gold italic">I.</span>
                                <span className="text-slate-700 italic">{subject.intro.general_tips}</span>
                            </li>
                            <li className="flex gap-3 pt-4 border-t border-academic-green/10">
                                <span className="font-bold text-red-800/70 italic">NB.</span>
                                <div>
                                    <span className="font-bold text-sm uppercase tracking-widest text-red-800/70 block mb-1 font-sans">Important Notice</span>
                                    <span className="text-slate-700 italic">{subject.intro.things_to_keep_in_mind}</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </aside>
            </section>

            {/* UnitBreakdown */}
            <section className="mb-20 print-page-break">
                <div className="ornament mb-16 text-2xl font-serif italic text-academic-gold">Course Curriculum</div>
                <div className="space-y-16">
                    {subject.units.map((unit) => (
                        <article key={unit.unit_number} className="flex flex-col md:flex-row gap-6 md:gap-10 items-start print-break-avoid">
                            <div className="text-6xl md:text-7xl font-extralight text-black/10 font-sans leading-none shrink-0 w-24">
                                {String(unit.unit_number).padStart(2, '0')}
                            </div>
                            <div className="flex-1 w-full">
                                <div className="flex flex-wrap items-center gap-4 mb-4">
                                    <h3 className="text-2xl md:text-3xl font-bold font-serif">{unit.title}</h3>
                                    <span className="h-px flex-1 bg-border hidden sm:block min-w-[50px]"></span>
                                </div>

                                <div className="flex gap-3 mb-6 font-sans">
                                    <span className={`px-2.5 py-1 rounded border text-[10px] uppercase tracking-widest font-bold ${unit.unit_difficulty === 'easy' ? 'bg-green-100 text-green-800 border-green-200' : unit.unit_difficulty === 'hard' ? 'bg-red-100 text-red-800 border-red-200' : 'bg-amber-100 text-amber-800 border-amber-200'}`}>
                                        {unit.unit_difficulty}
                                    </span>
                                    <span className="px-2.5 py-1 bg-slate-100 rounded border border-slate-200 text-slate-700 text-[10px] uppercase font-bold tracking-widest">
                                        {unit.scoring_value} Scoring
                                    </span>
                                </div>

                                <div className="text-slate-800 font-serif text-lg leading-relaxed bg-white/50 p-6 rounded-sm border border-black/5">
                                    <ul className="list-disc list-inside space-y-2 marker:text-academic-gold">
                                        {unit.topics.map((topic, idx) => (
                                            <li key={idx} className="inline"><ReactMarkdown>{topic}</ReactMarkdown></li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* Strategies Section */}
            {(subject.midsem_strategy || subject.endsem_strategy) && (
                <section className="mb-20 print-page-break">
                    <div className="ornament mb-12 text-2xl font-serif italic text-academic-gold">Examination Discourse</div>
                    <div className="grid md:grid-cols-2 gap-10 print:flex print:flex-col print:gap-10">
                        {subject.midsem_strategy && (
                            <div className="encyclopedia-card p-8 md:p-10 relative overflow-hidden print-break-avoid">
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-academic-gold/50"></div>
                                <h3 className="text-xl font-bold mb-6 font-serif flex items-center gap-2">
                                    <span className="text-academic-gold italic">§</span> Mid-Semester Thesis
                                </h3>
                                <div className="prose prose-lg font-serif text-slate-700 max-w-none leading-relaxed prose-headings:font-serif prose-headings:text-academic-green">
                                    <ReactMarkdown>{subject.midsem_strategy}</ReactMarkdown>
                                </div>
                            </div>
                        )}
                        {subject.endsem_strategy && (
                            <div className="encyclopedia-card p-8 md:p-10 relative overflow-hidden print-break-avoid">
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-academic-green/50"></div>
                                <h3 className="text-xl font-bold mb-6 font-serif flex items-center gap-2">
                                    <span className="text-academic-green italic">§</span> End-Semester Thesis
                                </h3>
                                <div className="prose prose-lg font-serif text-slate-700 max-w-none leading-relaxed prose-headings:font-serif prose-headings:text-academic-green">
                                    <ReactMarkdown>{subject.endsem_strategy}</ReactMarkdown>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Learning Resources */}
            {subject.materials && subject.materials.length > 0 && (
                <section className="mb-20 pt-10 border-t border-border border-dashed">
                    <h2 className="text-2xl font-bold mb-8 text-center italic font-serif">Supplementary Literature</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {subject.materials.map((mat, idx) => (
                            <a
                                key={idx}
                                href={mat.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-start gap-4 p-4 hover:bg-white/50 rounded transition-colors border-b border-border/50 hover:border-academic-green print-break-avoid"
                            >
                                <div className="mt-1 opacity-50 text-academic-gold group-hover:opacity-100 transition-opacity">
                                    <BookOpen size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold font-serif text-lg leading-snug group-hover:text-academic-gold transition-colors">{mat.title}</h4>
                                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mt-1.5 font-sans">{mat.type}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </section>
            )}

            {/* PreviousYearQuestions */}
            {(subject.midsem_pyq_url || subject.endsem_pyq_url) && (
                <section className="mb-20 pt-10 border-t border-border border-dashed print-page-break-before">
                    <h2 className="text-3xl font-bold mb-10 text-center italic font-serif">Previous Year Questions</h2>
                    <div className="flex flex-col md:flex-row gap-8 justify-center items-center max-w-4xl mx-auto">
                        {subject.midsem_pyq_url && (
                            <SyllabusButton url={subject.midsem_pyq_url} label="Mid-Semester Examination" />
                        )}
                        {subject.endsem_pyq_url && (
                            <SyllabusButton url={subject.endsem_pyq_url} label="End-Semester Examination" />
                        )}
                    </div>
                </section>
            )}

            {/* MainFooter Signature */}
            {subject.authors && subject.authors.length > 0 && (
                <div className="mt-16 pt-10 border-t border-border flex flex-col items-center justify-center text-slate-500">
                    <div className="h-px w-24 bg-border mx-auto mb-6"></div>
                    <p className="text-sm italic font-serif opacity-80">
                        Curated by{" "}
                        <span className="font-bold text-academic-green">
                            {subject.authors.map(a => a.display_name).join(", ")}
                        </span>
                    </p>
                </div>
            )}
        </div>
    );
}
