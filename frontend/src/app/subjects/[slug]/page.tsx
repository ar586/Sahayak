import { BookOpen, AlertTriangle, ShieldCheck, Target, TrendingUp, Clock, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import ImageModal from "@/components/ImageModal";

interface Unit {
    unit_number: number;
    title: string;
    unit_difficulty: string;
    scoring_value: string;
    skip_safe: boolean;
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
        const res = await fetch(`http://127.0.0.1:8000/subjects/${slug}`, { cache: "no-store" });
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

export default async function SubjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    const subject = await getSubject(slug);

    if (!subject) {
        return (
            <div className="text-center py-20">
                <h1 className="text-3xl font-bold mb-4">Subject Not Found</h1>
                <p className="text-gray-400">The subject you are looking for doesn't exist.</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 py-8">
            <header className="grid md:grid-cols-[1fr_2fr] gap-8 items-start pb-4">
                {/* Image Section */}
                <div className="w-full relative rounded-2xl overflow-hidden shadow-sm border border-border bg-surface flex items-center justify-center aspect-[4/3] md:min-h-[300px]">
                    {subject.syllabus_image_url ? (
                        <ImageModal
                            src={subject.syllabus_image_url}
                            alt={`${subject.name} cover`}
                            className="w-full h-full absolute inset-0"
                            imgClassName="!object-cover"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-slate-500 py-12">
                            <BookOpen size={48} className="mb-4 opacity-20" />
                            <p className="text-sm">No cover image provided</p>
                        </div>
                    )}
                </div>

                {/* Info Section */}
                <div className="space-y-6">
                    <div className="flex flex-wrap gap-2 items-center">
                        <span className="badge bg-primary/10 text-primary border-primary/20 text-sm">Sem {subject.course.semester}</span>
                        <span className="badge bg-secondary/10 text-secondary border-secondary/20 text-sm">{subject.course.department}</span>
                        <span className="text-slate-400 text-sm ml-2 font-medium">{subject.course.course_id}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">{subject.name}</h1>

                    {/* Overview Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="glass-panel p-4 flex flex-col justify-center border-none bg-surface shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-10"><TrendingUp size={48} /></div>
                            <span className="block text-slate-400 text-xs uppercase tracking-wider mb-1">Difficulty</span>
                            <span className="font-semibold text-lg capitalize text-white">{subject.overview.overall_difficulty}</span>
                        </div>
                        <div className="glass-panel p-4 flex flex-col justify-center border-none bg-surface shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-10"><Clock size={48} /></div>
                            <span className="block text-slate-400 text-xs uppercase tracking-wider mb-1">Time</span>
                            <span className="font-semibold text-lg capitalize text-white">{subject.overview.time_required}</span>
                        </div>
                        <div className="glass-panel p-4 flex flex-col justify-center border-none bg-surface shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-10"><Target size={48} /></div>
                            <span className="block text-slate-400 text-xs uppercase tracking-wider mb-1">Scoring</span>
                            <span className="font-semibold text-lg capitalize text-white">{subject.overview.scoring_potential}</span>
                        </div>
                        <div className="glass-panel p-4 flex flex-col justify-center border-none bg-surface shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-10"><BookOpen size={48} /></div>
                            <span className="block text-slate-400 text-xs uppercase tracking-wider mb-1">Type</span>
                            <span className="font-semibold text-lg capitalize text-white">{subject.overview.nature_type}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Intro Section */}
            <section className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold flex items-center gap-2 text-white"><BookOpen className="text-primary" /> Overview</h2>
                    <p className="text-slate-300 leading-relaxed text-lg">{subject.intro.about_subject}</p>
                </div>
                <div className="space-y-4 glass-panel p-6 bg-surface-hover/50 border-none shadow-sm pb-8">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-white"><Target className="text-secondary" /> General Tips</h2>
                    <p className="text-slate-300 mb-4">{subject.intro.general_tips}</p>
                    <div className="bg-surface p-4 rounded-lg border-l-4 border-yellow-500 shadow-sm">
                        <p className="text-sm text-yellow-500 font-bold mb-1 tracking-wide">KEEP IN MIND</p>
                        <p className="text-slate-300 text-sm">{subject.intro.things_to_keep_in_mind}</p>
                    </div>
                </div>
            </section>

            {/* Units Section */}
            <section className="space-y-6 pt-4">
                <h2 className="text-3xl font-bold text-white mb-6">Unit Breakdown</h2>
                <div className="space-y-8">
                    {subject.units.map((unit) => (
                        <div key={unit.unit_number} className="glass-panel overflow-hidden border-none shadow-sm bg-surface">
                            <div className="bg-surface p-6 flex flex-wrap justify-between items-center gap-4 border-b border-border">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center text-xl font-bold shadow-sm">
                                        {unit.unit_number}
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">{unit.title}</h3>
                                </div>
                                <div className="flex gap-3 text-sm font-medium">
                                    <span className={`px-3 py-1 rounded-full border ${unit.unit_difficulty === 'easy' ? 'bg-green-500/10 text-green-400 border-green-500/20' : unit.unit_difficulty === 'hard' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'} capitalize`}>
                                        {unit.unit_difficulty} Difficulty
                                    </span>
                                    <span className="px-3 py-1 bg-surface-hover rounded-full border border-border text-slate-300 capitalize">
                                        {unit.scoring_value} Scoring
                                    </span>
                                </div>
                            </div>
                            <div className="px-6 pb-6 pt-6 space-y-4">
                                {unit.topics.map((topic, idx) => (
                                    <div key={idx} className="prose prose-lg max-w-none leading-relaxed text-slate-200 marker:text-primary prose-headings:text-white prose-strong:text-white prose-a:text-primary hover:prose-a:text-primary-hover">
                                        <ReactMarkdown>{topic}</ReactMarkdown>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Strategies */}
            <section className="grid md:grid-cols-2 gap-6 pt-8 mt-8 border-t border-border">
                <div className="glass-panel p-8 relative overflow-hidden bg-surface border-none shadow-sm">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white"><FileText className="text-blue-500" /> Midsem Strategy</h2>
                    <div className="prose prose-lg max-w-none leading-relaxed text-slate-200 marker:text-primary prose-headings:text-white prose-strong:text-white prose-a:text-primary hover:prose-a:text-primary-hover">
                        <ReactMarkdown>{subject.midsem_strategy}</ReactMarkdown>
                    </div>
                </div>
                <div className="glass-panel p-8 relative overflow-hidden bg-surface border-none shadow-sm">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-500"></div>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white"><FileText className="text-purple-500" /> Endsem Strategy</h2>
                    <div className="prose prose-lg max-w-none leading-relaxed text-slate-200 marker:text-primary prose-headings:text-white prose-strong:text-white prose-a:text-primary hover:prose-a:text-primary-hover">
                        <ReactMarkdown>{subject.endsem_strategy}</ReactMarkdown>
                    </div>
                </div>
            </section>

            {/* Materials and Resources Section */}
            {subject.materials && subject.materials.length > 0 && (
                <section className="space-y-6 pt-8 mt-8 border-t border-border">
                    <h2 className="text-3xl font-bold text-white mb-6">Learning Resources</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {subject.materials.map((mat, idx) => (
                            <a
                                key={idx}
                                href={mat.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="glass-panel p-6 flex items-center justify-between group hover:-translate-y-1 transition-transform border-none shadow-sm bg-surface cursor-pointer ring-1 ring-white/5 hover:ring-primary/50"
                            >
                                <div className="space-y-1 overflow-hidden pr-4">
                                    <h3 className="font-semibold text-white truncate text-lg group-hover:text-primary transition-colors">{mat.title}</h3>
                                    <p className="text-sm text-slate-400 capitalize">{mat.type}</p>
                                </div>
                                <div className="w-10 h-10 shrink-0 bg-surface-hover rounded-full flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                                    <BookOpen size={18} />
                                </div>
                            </a>
                        ))}
                    </div>
                </section>
            )}

            {/* PYQ Images Section */}
            {(subject.midsem_pyq_url || subject.endsem_pyq_url) && (
                <section className="space-y-6 pt-8 mt-8 border-t border-border">
                    <h2 className="text-3xl font-bold text-white mb-6 text-center">Previous Year Questions</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {subject.midsem_pyq_url && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-slate-300 text-center">Midsem PYQ</h3>
                                <div className="w-full relative rounded-2xl overflow-hidden shadow-sm border border-border bg-surface flex items-center justify-center aspect-square md:aspect-[4/3]">
                                    <ImageModal
                                        src={subject.midsem_pyq_url}
                                        alt={`${subject.name} Midsem PYQ`}
                                        className="w-full h-full absolute inset-0"
                                        imgClassName="!object-cover"
                                    />
                                </div>
                            </div>
                        )}
                        {subject.endsem_pyq_url && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-slate-300 text-center">Endsem PYQ</h3>
                                <div className="w-full relative rounded-2xl overflow-hidden shadow-sm border border-border bg-surface flex items-center justify-center aspect-square md:aspect-[4/3]">
                                    <ImageModal
                                        src={subject.endsem_pyq_url}
                                        alt={`${subject.name} Endsem PYQ`}
                                        className="w-full h-full absolute inset-0"
                                        imgClassName="!object-cover"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Author Section */}
            {subject.authors && subject.authors.length > 0 && (
                <div className="mt-12 pt-6 border-t border-border flex flex-col items-center justify-center text-slate-400">
                    <p className="text-sm">
                        Curated with <span className="text-red-500">♥</span> by{" "}
                        <span className="font-semibold text-white">
                            {subject.authors.map(a => a.display_name).join(", ")}
                        </span>
                    </p>
                </div>
            )}

        </div>
    );
}
