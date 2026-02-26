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
            const res = await fetch("http://127.0.0.1:8000/users/me/subjects", {
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
            const res = await fetch(`http://127.0.0.1:8000/subjects/${id}`, {
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
        <div className="max-w-7xl mx-auto py-12 px-4 space-y-12">

            {/* Header section */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">My Dashboard</h1>
                    <p className="text-slate-400">Welcome back, {user?.display_name}. Track your contributions here.</p>
                </div>
                <Link href="/contribute" className="btn-primary text-sm py-2.5 px-6 self-start md:self-auto">
                    + Contribute New Subject
                </Link>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                        <BookOpen size={28} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-400">Total Contributions</p>
                        <p className="text-3xl font-bold text-white">{subjects.length}</p>
                    </div>
                </div>
                <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                        <CheckCircle size={28} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-400">Published</p>
                        <p className="text-3xl font-bold text-white">{publishedCount}</p>
                    </div>
                </div>
                <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center">
                        <Clock size={28} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-400">Pending Review</p>
                        <p className="text-3xl font-bold text-white">{pendingCount}</p>
                    </div>
                </div>
            </div>

            {/* Contributions List */}
            <section>
                <h2 className="text-2xl font-bold text-white mb-6">Subject Submissions</h2>

                {subjects.length === 0 ? (
                    <div className="glass-panel p-12 rounded-2xl text-center text-slate-400">
                        <p className="text-lg mb-4">You haven't contributed any subjects yet.</p>
                        <Link href="/contribute" className="text-primary hover:text-primary-hover font-medium transition-colors">
                            Start your first contribution →
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {subjects.map((subject) => (
                            <div key={subject.id} className="glass-panel p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-white">{subject.name}</h3>
                                        {subject.is_published ? (
                                            <span className="badge bg-green-500/10 text-green-500 border-green-500/20">Published</span>
                                        ) : (
                                            <span className="badge bg-amber-500/10 text-amber-500 border-amber-500/20">In Review</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-400 flex items-center gap-3">
                                        <span>Course: {subject.course?.course_id}</span>
                                        <span>•</span>
                                        <span>Submitted: {new Date(subject.created_at).toLocaleDateString()}</span>
                                    </p>
                                </div>
                                <div className="flex gap-3 mt-4 md:mt-0">
                                    {subject.is_published && (
                                        <Link href={`/subjects/${subject.slug}`} className="btn-outline text-sm py-2 px-4 shadow-sm border-slate-600 hover:border-slate-500 text-white">
                                            View Public Page
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => handleDelete(subject.id)}
                                        className="btn-outline text-sm py-2 px-4 shadow-sm border-red-900/50 hover:border-red-500 hover:text-red-500 text-slate-300 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

        </div>
    );
}
