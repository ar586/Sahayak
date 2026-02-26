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
        <div className="max-w-7xl mx-auto py-8 px-4 text-white grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sidebar: List of pending and published subjects */}
            <div className="md:col-span-1 space-y-4">
                <h2 className="text-2xl font-bold mb-6">Manage Subjects</h2>

                {drafts.length === 0 ? (
                    <div className="glass-panel p-6 text-slate-400 text-center rounded-xl">
                        No pending subjects at this time.
                    </div>
                ) : (
                    drafts.map(draft => (
                        <div
                            key={draft.id}
                            onClick={() => setSelectedDraft(draft)}
                            className={`glass-panel p-4 rounded-xl cursor-pointer transition-colors ${selectedDraft?.id === draft.id ? 'border-primary bg-primary/10' : 'hover:bg-surface-hover/50'}`}
                        >
                            <h3 className="font-semibold text-white mb-1 truncate">{draft.name}</h3>
                            <p className="text-sm text-slate-400">By {draft.authors?.[0]?.display_name || 'Unknown'}</p>
                            <div className="flex justify-between items-center mt-2">
                                <p className="text-xs text-slate-500">{new Date(draft.created_at).toLocaleDateString()}</p>
                                {draft.is_published ? (
                                    <span className="text-xs badge bg-green-500/10 text-green-500 border-green-500/20">Published</span>
                                ) : (
                                    <span className="text-xs badge bg-amber-500/10 text-amber-500 border-amber-500/20">Draft</span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Main content: JSON Preview and Actions */}
            <div className="md:col-span-2 glass-panel p-8 rounded-2xl min-h-[600px] flex flex-col">
                {selectedDraft ? (
                    <>
                        <div className="flex justify-between items-start mb-6 pb-6 border-b border-border">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">{selectedDraft.name}</h1>
                                <p className="text-slate-400">
                                    Submitted by <span className="text-slate-200">{selectedDraft.authors?.[0]?.display_name || 'Unknown'}</span>
                                    {' '}on {new Date(selectedDraft.created_at).toLocaleString()}
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        if (window.confirm(`Are you sure you want to completely delete "${selectedDraft.name}"? This cannot be undone.`)) {
                                            handleAction(selectedDraft.id, "delete")
                                        }
                                    }}
                                    disabled={actionLoading}
                                    className="px-4 py-2 rounded-lg border border-red-500/50 text-red-500 hover:bg-red-500/10 font-medium transition-colors"
                                >
                                    Delete
                                </button>

                                {!selectedDraft.is_published && (
                                    <>
                                        <button
                                            onClick={() => handleAction(selectedDraft.id, "reject")}
                                            disabled={actionLoading}
                                            className="px-4 py-2 rounded-lg border border-amber-500/50 text-amber-500 hover:bg-amber-500/10 font-medium transition-colors"
                                        >
                                            Reject
                                        </button>
                                        <button
                                            onClick={() => handleAction(selectedDraft.id, "publish")}
                                            disabled={actionLoading}
                                            className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium transition-colors"
                                        >
                                            Publish Subject
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 overflow-auto bg-surface-hover/30 rounded-lg p-6 font-mono text-sm border border-border">
                            <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">Structured Data Output</h3>
                            <pre className="text-green-400/90 whitespace-pre-wrap">
                                {JSON.stringify(selectedDraft, null, 2)}
                            </pre>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                        <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p>Select a draft subject from the queue to review</p>
                    </div>
                )}
            </div>
        </div>
    );
}
