"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("search") || "");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/?search=${encodeURIComponent(query.trim())}`);
        } else {
            router.push(`/`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="flex w-full max-w-xl mx-auto items-center mt-8">
            <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                    <Search size={20} />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="bg-surface border border-border text-white text-base rounded-xl focus:ring-primary focus:border-primary block w-full outline-none pl-12 p-3.5 shadow-sm transition-all"
                    placeholder="Search by subject name..."
                />
            </div>
            <button type="submit" className="ml-3 btn-primary py-[15px] px-6 shadow-sm font-medium whitespace-nowrap hidden sm:block">
                Search
            </button>
        </form>
    );
}
