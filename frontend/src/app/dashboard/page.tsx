"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, CheckCircle, Clock } from "lucide-react";

export default function UserDashboardPage() {
    const { user, token, loading } = useAuth();
    const router = useRouter();

    const [subjects, setSubjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchMySubjects = useCallback(async () => {
        if (!token) return;
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
            const res = await fetch(`${API_URL}/users/me/subjects`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to fetch subjects");
            const data = await res.json();
            setSubjects(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to completely delete this subject? This cannot be undone.")) return;

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
            const res = await fetch(`${API_URL}/subjects/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to delete subject");
            setSubjects(subjects.filter(s => s.id !== id));
        } catch (err) {
            console.error(err);
            alert("Error deleting subject");
        }
    };

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        } else if (user) {
            fetchMySubjects();
        }
    }, [user, loading, router, fetchMySubjects]);

    if (loading || isLoading) return <div className="text-center py-20">Loading dashboard...</div>;

    const publishedCount = subjects.filter(s => s.is_published).length;
    const pendingCount = subjects.filter(s => !s.is_published).length;

    return (
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-10 flex flex-col md:flex-row gap-10 mt-4 text-academic-green pb-24">

            {/* Left Sidebar */}
            <aside className="w-full md:w-1/4 shrink-0 space-y-8">
                {/* Profile Card */}
                <div className="encyclopedia-card p-6 text-center shadow-sm rounded border border-border">
                    <div className="w-20 h-20 bg-academic-parchment border-2 border-academic-gold/50 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-3xl font-serif text-academic-gold italic">{user?.display_name?.charAt(0).toUpperCase() || "S"}</span>
                    </div>
                    <h2 className="text-xl font-bold font-serif mb-1">{user?.display_name}</h2>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-sans font-bold">Contributor</p>

                    <div className="mt-6 pt-6 border-t border-border">
                        <Link href="/contribute" className="w-full block text-center border-2 border-academic-green bg-academic-green text-academic-parchment hover:bg-transparent hover:text-academic-green py-2.5 font-bold uppercase tracking-widest text-[10px] transition-all rounded shadow-sm">
                            + Contribute Entry
                        </Link>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="hidden md:block encyclopedia-card p-4 shadow-sm rounded border border-border">
                    <ul className="space-y-1 font-serif">
                        <li>
                            <Link href="#" className="flex items-center gap-3 px-4 py-2.5 bg-academic-parchment text-academic-gold font-bold italic rounded">
                                <BookOpen size={18} /> Overview
                            </Link>
                        </li>
                        <li>
                            <Link href="#ledger" className="flex items-center gap-3 px-4 py-2.5 hover:bg-academic-parchment/50 text-academic-green hover:text-academic-gold rounded transition-colors group">
                                <CheckCircle size={18} className="opacity-50 group-hover:opacity-100" /> Submissions
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 w-full">

                <header className="mb-10 pb-6 border-b-2 border-academic-gold/30 flex flex-col items-center text-center">
                    <p className="uppercase tracking-widest text-xs mb-2 opacity-70 font-sans font-bold">Personal Archives</p>
                    <h1 className="text-4xl md:text-5xl font-extrabold font-display">Scholar Dashboard</h1>
                </header>

                {/* Stats Blocks */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                    <div className="encyclopedia-card p-6 font-serif shadow-sm rounded border border-border relative overflow-hidden group">
                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity"><BookOpen size={100} /></div>
                        <h3 className="text-sm font-sans uppercase font-bold tracking-widest text-slate-500 mb-2">Total Contributions</h3>
                        <p className="text-4xl text-academic-gold font-bold italic">{subjects.length}</p>
                    </div>
                    <div className="encyclopedia-card p-6 font-serif shadow-sm rounded border border-border relative overflow-hidden group">
                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity"><CheckCircle size={100} /></div>
                        <h3 className="text-sm font-sans uppercase font-bold tracking-widest text-slate-500 mb-2">Published</h3>
                        <p className="text-4xl text-academic-green font-bold italic">{publishedCount}</p>
                    </div>
                    <div className="encyclopedia-card p-6 font-serif shadow-sm rounded border border-border relative overflow-hidden group bg-academic-parchment/30">
                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity"><Clock size={100} /></div>
                        <h3 className="text-sm font-sans uppercase font-bold tracking-widest text-slate-500 mb-2">Pending Review</h3>
                        <p className="text-4xl text-slate-700 font-bold italic">{pendingCount}</p>
                    </div>
                </div>

                {/* Ledger / Table */}
                <section id="ledger" className="font-serif">
                    <h2 className="text-2xl font-bold mb-6 italic text-academic-gold font-serif">Contribution Ledger</h2>

                    <div className="bg-white border-2 border-academic-green shadow-sm overflow-hidden vintage-border rounded">
                        <div className="overflow-x-auto">
                            {subjects.length === 0 ? (
                                <div className="p-12 text-center text-slate-500 bg-academic-parchment/20">
                                    <p className="text-lg italic mb-4 font-serif">Your ledger is currently empty.</p>
                                    <Link href="/contribute" className="text-academic-gold border-b border-academic-gold font-bold uppercase tracking-widest text-xs font-sans hover:text-academic-green transition-colors">Begin Your First Entry</Link>
                                </div>
                            ) : (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-academic-green text-academic-parchment text-[10px] uppercase font-bold tracking-widest font-sans border-b-2 border-academic-gold">
                                            <th className="p-4 font-normal">Document Title</th>
                                            <th className="p-4 font-normal">Course Code</th>
                                            <th className="p-4 font-normal">Date Submitted</th>
                                            <th className="p-4 font-normal">Status</th>
                                            <th className="p-4 font-normal text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-academic-green/10 bg-white text-sm">
                                        {subjects.map((subject) => (
                                            <tr key={subject.id} className="hover:bg-academic-parchment/30 transition-colors">
                                                <td className="p-4 font-bold italic text-academic-gold text-base">{subject.name}</td>
                                                <td className="p-4 font-sans font-bold uppercase text-[10px] tracking-widest text-slate-500">{subject.course?.course_id}</td>
                                                <td className="p-4 text-slate-600">{new Date(subject.created_at).toLocaleDateString()}</td>
                                                <td className="p-4">
                                                    {subject.is_published ? (
                                                        <span className="px-2 py-1 bg-green-100 text-green-800 border border-green-200 rounded font-sans uppercase font-bold text-[9px] tracking-wider">Published</span>
                                                    ) : (
                                                        <span className="px-2 py-1 bg-amber-100 text-amber-800 border border-amber-200 rounded font-sans uppercase font-bold text-[9px] tracking-wider">Pending</span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-right space-x-3">
                                                    {subject.is_published && (
                                                        <Link href={`/subjects/${subject.slug}`} className="text-[10px] font-sans uppercase font-bold tracking-widest text-academic-green hover:border-b hover:border-academic-green transition-all">View</Link>
                                                    )}
                                                    <button onClick={() => handleDelete(subject.id)} className="text-[10px] font-sans uppercase font-bold tracking-widest text-red-700/70 hover:text-red-700 hover:border-b hover:border-red-700 transition-all">Withdraw</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
}
