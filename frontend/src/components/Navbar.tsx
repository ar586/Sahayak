"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const { user, logout, loading } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMenu = () => setIsMobileMenuOpen(false);

    return (
        <nav className="w-full border-b border-academic-green/20 bg-academic-cream/80 backdrop-blur-sm sticky top-0 z-50 text-academic-green">
            <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
                    <div className="w-10 h-10 bg-academic-green flex items-center justify-center rounded-custom shadow-sm shrink-0">
                        <span className="text-academic-gold font-bold text-xl italic font-serif">S</span>
                    </div>
                    <span className="text-2xl font-bold tracking-tight uppercase font-display hidden sm:block">Sahayak</span>
                </Link>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-academic-green hover:bg-academic-green/10 rounded"
                    onClick={toggleMenu}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8 font-bold uppercase text-xs tracking-widest">
                    <Link href="/" className="hover:text-academic-gold transition-colors">Subjects</Link>
                    <Link href="/team" className="hover:text-academic-gold transition-colors">Team</Link>

                    {!loading && (
                        <>
                            {user ? (
                                <>
                                    <Link href="/dashboard" className="hover:text-academic-gold transition-colors">Dashboard</Link>
                                    <Link href="/contribute" className="hover:text-academic-gold transition-colors">Contribute</Link>
                                    {user.role === 'admin' && (
                                        <Link href="/admin/contributions" className="text-amber-700 hover:text-amber-500 transition-colors">Admin</Link>
                                    )}
                                    <button onClick={logout} className="border border-academic-green px-6 py-2 rounded-custom hover:bg-academic-green hover:text-academic-cream transition-all uppercase text-xs tracking-widest font-bold">Logout</button>
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

            {/* Mobile Navigation Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-20 left-0 w-full bg-academic-cream border-b border-academic-green/20 shadow-lg flex flex-col items-center py-6 space-y-6 font-bold uppercase text-sm tracking-widest">
                    <Link href="/" onClick={closeMenu} className="hover:text-academic-gold transition-colors">Subjects</Link>
                    <Link href="/team" onClick={closeMenu} className="hover:text-academic-gold transition-colors">Team</Link>

                    {!loading && (
                        <>
                            {user ? (
                                <>
                                    <Link href="/dashboard" onClick={closeMenu} className="hover:text-academic-gold transition-colors">Dashboard</Link>
                                    <Link href="/contribute" onClick={closeMenu} className="hover:text-academic-gold transition-colors">Contribute</Link>
                                    {user.role === 'admin' && (
                                        <Link href="/admin/contributions" onClick={closeMenu} className="text-amber-700 hover:text-amber-500 transition-colors">Admin</Link>
                                    )}
                                    <button onClick={() => { logout(); closeMenu(); }} className="border-2 border-academic-green px-8 py-2.5 rounded hover:bg-academic-green hover:text-academic-cream transition-all">Logout</button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" onClick={closeMenu} className="hover:text-academic-gold transition-colors">Login</Link>
                                    <Link href="/signup" onClick={closeMenu} className="bg-academic-green text-academic-cream px-8 py-2.5 rounded hover:bg-academic-green/90 transition-all">Sign Up</Link>
                                </>
                            )}
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
