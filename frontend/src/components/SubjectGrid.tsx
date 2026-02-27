"use client";

import { useState, useMemo } from "react";
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

export default function SubjectGrid({ subjects, search }: { subjects: Subject[], search?: string }) {
    const [sortBy, setSortBy] = useState("semester-asc");
    const [filterDept, setFilterDept] = useState("All");

    const departments = ["All", ...Array.from(new Set(subjects.map(s => s.course.department)))];

    const processedSubjects = useMemo(() => {
        let result = [...subjects];

        // Filter by department
        if (filterDept !== "All") {
            result = result.filter(s => s.course.department === filterDept);
        }

        // Sort
        result.sort((a, b) => {
            if (sortBy === "semester-asc") return a.course.semester - b.course.semester;
            if (sortBy === "semester-desc") return b.course.semester - a.course.semester;
            if (sortBy === "name-asc") return a.name.localeCompare(b.name);
            if (sortBy === "name-desc") return b.name.localeCompare(a.name);
            return 0;
        });

        return result;
    }, [subjects, filterDept, sortBy]);

    return (
        <main className="max-w-7xl mx-auto px-8 pb-32 w-full flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 border-b-2 border-academic-gold/30 pb-4 gap-4">
                <h2 className="text-2xl font-medium italic pb-1 font-serif">
                    {search ? `Search Archives for "${search}"` : "Current Curriculum"}
                </h2>

                <div className="flex flex-wrap gap-6 items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-academic-green/60 font-sans">Filter Dept</span>
                        <select
                            value={filterDept}
                            onChange={(e) => setFilterDept(e.target.value)}
                            className="text-sm font-serif italic bg-transparent border-b-2 border-academic-gold/30 text-academic-green hover:border-academic-gold focus:outline-none focus:border-academic-green py-1 cursor-pointer transition-colors"
                        >
                            {departments.map(dept => (
                                <option key={dept} value={dept}>{dept === "All" ? "All Departments" : dept}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-academic-green/60 font-sans">Sort By</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="text-sm font-serif italic bg-transparent border-b-2 border-academic-gold/30 text-academic-green hover:border-academic-gold focus:outline-none focus:border-academic-green py-1 cursor-pointer transition-colors"
                        >
                            <option value="semester-asc">Semester (1 → 8)</option>
                            <option value="semester-desc">Semester (8 → 1)</option>
                            <option value="name-asc">Title (A → Z)</option>
                            <option value="name-desc">Title (Z → A)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {processedSubjects.map((subject) => (
                    <Link key={subject.id} href={`/subjects/${subject.slug}`} className="block">
                        <div className="vintage-border p-8 bg-academic-parchment library-card-shadow group cursor-pointer hover:-translate-y-1 transition-transform h-full flex flex-col">
                            <div className="flex justify-between items-start mb-6">
                                <span className="text-xs font-bold tracking-widest uppercase text-academic-gold font-sans">{subject.course.course_id}</span>
                                <div className="w-12 h-12 border-2 border-dotted border-academic-gold rounded-full flex items-center justify-center shrink-0">
                                    <div className="text-[10px] font-bold text-center leading-tight uppercase font-sans">Sem<br />{subject.course.semester}</div>
                                </div>
                            </div>

                            <h3 className="text-2xl font-semibold mb-4 min-h-[4rem] flex items-center font-display leading-tight">{subject.name}</h3>

                            <p className="text-sm italic opacity-80 mb-6 line-clamp-2 flex-grow font-serif">
                                {subject.intro?.about_subject}
                            </p>

                            <div className="border-t border-academic-green/10 pt-4 flex justify-between items-center italic text-sm opacity-70 font-serif mt-auto">
                                <span>{subject.course.department}</span>
                                <span className="capitalize">{subject.overview.overall_difficulty}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {processedSubjects.length === 0 && (
                <div className="text-center py-20 px-4 border border-academic-green/20 bg-academic-parchment/50 backdrop-blur-sm rounded-sm max-w-2xl mx-auto mt-12">
                    <p className="text-xl italic font-serif text-academic-green/70">The archives are currently empty for these parameters.</p>
                    <p className="text-sm mt-4 font-sans uppercase tracking-widest font-bold text-academic-gold">Adjust your filters or contribute a new text.</p>
                </div>
            )}
        </main>
    );
}
