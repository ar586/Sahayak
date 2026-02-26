"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const { user, logout, loading } = useAuth();

    return (
        <header className="border-b border-border bg-surface/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-white shadow-sm">
                        S
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">
                        Sahayak
                    </span>
                </Link>
                <nav className="flex gap-6 items-center">
                    <Link href="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Subjects</Link>

                    {!loading && (
                        <>
                            {user ? (
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-slate-300">Hi, {user.display_name}</span>
                                    <Link href="/dashboard" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Dashboard</Link>
                                    {user.role === 'admin' && (
                                        <Link href="/admin/contributions" className="text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors">Admin</Link>
                                    )}
                                    <button onClick={logout} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Logout</button>
                                    <Link href="/contribute" className="btn-primary text-sm py-1.5 px-4 block">Contribute</Link>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Login</Link>
                                    <Link href="/signup" className="btn-outline text-sm py-1.5 px-4 block">Sign Up</Link>
                                </div>
                            )}
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
