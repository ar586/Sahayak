"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminQueuePage() {
    const { user, token, loading } = useAuth();
    const router = useRouter();

    const [drafts, setDrafts] = useState<any[]>([]);
    const [selectedDraft, setSelectedDraft] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchQueue = useCallback(async () => {
        if (!token) return;
        try {
            const [pendingRes, publishedRes] = await Promise.all([
                fetch("http://127.0.0.1:8000/admin/queue", {
                    headers: { "Authorization": `Bearer ${token}` }
                }),
                fetch("http://127.0.0.1:8000/subjects")
            ]);

            if (!pendingRes.ok || !publishedRes.ok) throw new Error("Failed to fetch subjects");

            const pendingData = await pendingRes.json();
            const publishedData = await publishedRes.json();

            setDrafts([...pendingData, ...publishedData]);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (!loading && (!user || user.role !== "admin")) {
            router.push("/");
        } else if (user?.role === "admin") {
            fetchQueue();
        }
    }, [user, loading, router, fetchQueue]);

    const handleAction = async (id: string, action: "publish" | "reject" | "delete") => {
        setActionLoading(true);
        try {
            const method = action === "delete" ? "DELETE" : "PUT";
            const url = action === "delete"
                ? `http://127.0.0.1:8000/subjects/${id}`
                : `http://127.0.0.1:8000/admin/${action}/${id}`;

            const res = await fetch(url, {
                method,
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!res.ok) throw new Error(`Failed to ${action}`);

            // Remove from list and clear selection
            setDrafts(drafts.filter(d => d.id !== id));
            setSelectedDraft(null);
        } catch (err) {
            console.error(err);
            alert(`Error trying to ${action} subject`);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading || isLoading) return <div className="text-center py-20">Loading admin panel...</div>;

    return (
        <div className="max-w-[1200px] mx-auto py-12 px-4 md:px-8 text-academic-green grid grid-cols-1 md:grid-cols-3 gap-8 pb-24">
            {/* Sidebar: List of pending and published subjects */}
            <div className="md:col-span-1 space-y-4">
                <header className="mb-6 pb-4 border-b-2 border-academic-gold/30">
                    <p className="uppercase tracking-widest text-[10px] mb-1 opacity-70 font-sans font-bold">Curator Tools</p>
                    <h2 className="text-3xl font-bold font-serif italic text-academic-gold">Archives Queue</h2>
                </header>

                {drafts.length === 0 ? (
                    <div className="encyclopedia-card p-6 text-slate-500 text-center rounded border border-border italic font-serif bg-academic-parchment/30">
                        No pending manuscripts at this time.
                    </div>
                ) : (
                    drafts.map(draft => (
                        <div
                            key={draft.id}
                            onClick={() => setSelectedDraft(draft)}
                            className={`encyclopedia-card p-4 rounded cursor-pointer transition-colors border shadow-sm ${selectedDraft?.id === draft.id ? 'border-academic-green bg-academic-parchment/50' : 'border-border hover:bg-academic-parchment/20'}`}
                        >
                            <h3 className="font-bold font-serif text-academic-green mb-1 truncate text-lg">{draft.name}</h3>
                            <p className="font-sans uppercase text-[10px] tracking-widest font-bold text-slate-500 mb-2">Scribe: {draft.authors?.[0]?.display_name || 'Unknown'}</p>
                            <div className="flex justify-between items-center mt-2 pt-2 border-t border-academic-gold/20">
                                <p className="text-[10px] font-sans font-bold text-slate-400">{new Date(draft.created_at).toLocaleDateString()}</p>
                                {draft.is_published ? (
                                    <span className="px-2 py-1 uppercase font-bold text-[9px] tracking-wider font-sans border border-green-200 rounded text-green-800 bg-green-100">Published</span>
                                ) : (
                                    <span className="px-2 py-1 uppercase font-bold text-[9px] tracking-wider font-sans border border-amber-200 rounded text-amber-800 bg-amber-100">Pending</span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Main content: JSON Preview and Actions */}
            <div className="md:col-span-2 encyclopedia-card p-6 md:p-8 rounded shadow-sm border border-border min-h-[600px] flex flex-col bg-white">
                {selectedDraft ? (
                    <>
                        <div className="flex flex-col xl:flex-row justify-between xl:items-start gap-6 mb-8 pb-6 border-b-2 border-academic-gold/30">
                            <div>
                                <h1 className="text-4xl font-extrabold font-display mb-2">{selectedDraft.name}</h1>
                                <p className="font-sans uppercase text-[10px] tracking-widest font-bold text-slate-500">
                                    Transcribed by <span className="text-academic-green">{selectedDraft.authors?.[0]?.display_name || 'Unknown'}</span>
                                    {' '}| {new Date(selectedDraft.created_at).toLocaleString()}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => {
                                        if (window.confirm(`Are you sure you want to completely expunge "${selectedDraft.name}"? This cannot be undone.`)) {
                                            handleAction(selectedDraft.id, "delete")
                                        }
                                    }}
                                    disabled={actionLoading}
                                    className="px-6 py-2.5 rounded border-2 border-red-700/50 text-red-700 hover:bg-red-50 hover:border-red-700 font-bold uppercase text-[10px] tracking-widest font-sans transition-all shadow-sm focus:outline-none"
                                >
                                    Expunge
                                </button>

                                {!selectedDraft.is_published && (
                                    <>
                                        <button
                                            onClick={() => handleAction(selectedDraft.id, "reject")}
                                            disabled={actionLoading}
                                            className="px-6 py-2.5 rounded border-2 border-amber-500/50 text-amber-600 hover:bg-amber-50 hover:border-amber-500 font-bold uppercase text-[10px] tracking-widest font-sans transition-all shadow-sm focus:outline-none"
                                        >
                                            Reject
                                        </button>
                                        <button
                                            onClick={() => handleAction(selectedDraft.id, "publish")}
                                            disabled={actionLoading}
                                            className="px-6 py-2.5 rounded border-2 border-academic-green bg-academic-green text-academic-parchment hover:bg-transparent hover:text-academic-green font-bold uppercase text-[10px] tracking-widest font-sans transition-all shadow-sm focus:outline-none"
                                        >
                                            Publish Archive
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 overflow-auto bg-academic-parchment/40 rounded border border-academic-gold/30 p-6 font-mono text-sm vintage-border shadow-inner">
                            <h3 className="font-sans uppercase text-[10px] tracking-widest font-bold text-slate-500 mb-4 border-b border-academic-gold/20 pb-2">Raw JSON Inscription</h3>
                            <pre className="text-slate-800 whitespace-pre-wrap leading-relaxed">
                                {JSON.stringify(selectedDraft, null, 2)}
                            </pre>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-academic-gold/70 bg-academic-parchment/10 rounded border border-dashed border-academic-gold/30 m-4">
                        <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="font-serif italic text-lg">Select a manuscript from the queue to review.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
