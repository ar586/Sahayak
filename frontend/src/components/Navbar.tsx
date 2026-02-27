"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const { user, logout, loading } = useAuth();

    return (
        <nav className="w-full border-b border-academic-green/20 bg-academic-cream/80 backdrop-blur-sm sticky top-0 z-50 text-academic-green">
            <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-academic-green flex items-center justify-center rounded-custom shadow-sm">
                        <span className="text-academic-gold font-bold text-xl italic font-serif">S</span>
                    </div>
                    <span className="text-2xl font-bold tracking-tight uppercase font-display">Sahayak</span>
                </Link>
                <div className="flex items-center space-x-8 font-bold uppercase text-xs tracking-widest">
                    <Link href="/" className="hover:text-academic-gold transition-colors">Subjects</Link>

                    {!loading && (
                        <>
                            {user ? (
                                <>
                                    <Link href="/dashboard" className="hover:text-academic-gold transition-colors">Dashboard</Link>
                                    <Link href="/contribute" className="hover:text-academic-gold transition-colors">Contribute</Link>
                                    {user.role === 'admin' && (
                                        <Link href="/admin/contributions" className="text-amber-700 hover:text-amber-500 transition-colors">Admin</Link>
                                    )}
                                    <button onClick={logout} className="border border-academic-green px-6 py-2 rounded-custom hover:bg-academic-green hover:text-academic-cream transition-all">Logout</button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" className="hover:text-academic-gold transition-colors">Login</Link>
                                    <Link href="/signup" className="border border-academic-green px-6 py-2 rounded-custom hover:bg-academic-green hover:text-academic-cream transition-all">Sign Up</Link>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
