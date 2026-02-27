"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, User } from "lucide-react";

interface Subject {
    id: string;
    name: string;
    slug: string;
    course: { department: string; semester: number; course_id: string };
}

interface Contributor {
    user_id: string;
    display_name: string;
    subjects: Subject[];
}

export default function TeamList({ contributors }: { contributors: Contributor[] }) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleOpen = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    if (contributors.length === 0) {
        return (
            <div className="text-center py-20 text-academic-green/60 italic font-serif">
                No contributors found yet.
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 md:px-8 pb-32">
            <div className="space-y-4">
                {contributors.map((contributor, index) => {
                    const isOpen = openIndex === index;
                    return (
                        <div key={contributor.user_id} className="border border-academic-gold/30 bg-academic-parchment/30 rounded shadow-sm overflow-hidden transition-all duration-300">
                            <button
                                onClick={() => toggleOpen(index)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-academic-parchment transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-academic-green/10 rounded-full flex items-center justify-center text-academic-green">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-serif font-bold text-xl text-academic-green capitalize">{contributor.display_name}</h3>
                                        <span className="text-xs font-sans tracking-widest uppercase text-academic-gold font-bold">
                                            {contributor.subjects.length} {contributor.subjects.length === 1 ? 'Archive' : 'Archives'} Contributed
                                        </span>
                                    </div>
                                </div>
                                <div className="text-academic-green/50">
                                    {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                                </div>
                            </button>

                            {isOpen && (
                                <div className="px-6 py-4 bg-white border-t border-academic-gold/10">
                                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-4">Contributed Archives Overview</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {contributor.subjects.map(subject => (
                                            <Link
                                                key={subject.id}
                                                href={`/subjects/${subject.slug}`}
                                                className="group p-4 border border-border rounded flex flex-col gap-2 hover:border-academic-green/30 transition-colors"
                                            >
                                                <h5 className="font-serif font-bold text-academic-green group-hover:text-academic-gold transition-colors">{subject.name}</h5>
                                                <div className="flex flex-wrap gap-2 text-[10px] font-sans uppercase tracking-widest font-bold text-slate-500">
                                                    <span>{subject.course.department}</span>
                                                    <span>•</span>
                                                    <span>Sem {subject.course.semester}</span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
