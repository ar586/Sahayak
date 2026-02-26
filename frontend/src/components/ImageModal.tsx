"use client";

import { useState } from "react";
import { X, Maximize2 } from "lucide-react";

interface ImageModalProps {
    src: string;
    alt: string;
    className?: string;
    imgClassName?: string;
}

export default function ImageModal({ src, alt, className = "", imgClassName = "" }: ImageModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div
                className={`w-full relative group cursor-pointer overflow-hidden rounded-2xl ${className}`}
                onClick={() => setIsOpen(true)}
            >
                <img
                    src={src}
                    alt={alt}
                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${imgClassName}`}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize2 className="text-white w-8 h-8 drop-shadow-lg" />
                </div>
            </div>

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
                        src={src}
                        alt={alt}
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </>
    );
}
