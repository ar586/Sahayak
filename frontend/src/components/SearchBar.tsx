"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get("search") || "";
    const [query, setQuery] = useState(initialQuery);
    const isMounted = useRef(false);

    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }

        const timer = setTimeout(() => {
            if (query.trim()) {
                router.push(`/?search=${encodeURIComponent(query.trim())}`);
            } else {
                router.push(`/`);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query, router]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <form onSubmit={handleSearch} className="flex w-full max-w-2xl mx-auto items-center mt-8 relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-academic-green/40" />
            </div>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent border-t-0 border-l-0 border-r-0 border-b-2 border-academic-green/30 py-4 pl-12 pr-4 focus:ring-0 focus:border-academic-green placeholder:italic placeholder:text-academic-green/40 text-lg transition-all text-academic-green outline-none"
                placeholder="Search for subjects, course codes, or notes..."
            />
        </form>
    );
}
