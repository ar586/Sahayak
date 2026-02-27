"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function SyllabusButton({ url, label = "View Syllabus" }: { url: string, label?: string }) {
    const [isOpen, setIsOpen] = useState(false);

    if (!url) return null;

    return (
        <div className="inline-block">
            <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-academic-parchment hover:bg-academic-gold/20 text-academic-green border border-academic-gold/50 rounded shadow-sm font-bold uppercase tracking-widest text-xs font-sans transition-all"
            >
                {label}
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-12 cursor-zoom-out backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                >
                    <button
                        className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                        onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <img
                        src={url}
                        alt="Subject Syllabus"
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
}
