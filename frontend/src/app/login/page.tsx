"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.detail || "Login failed");
            }

            login(data.access_token, data.user);
            router.push("/");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-8 vintage-border bg-academic-parchment library-card-shadow relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-academic-gold/20"></div>
            <div className="text-center mb-8">
                <h1 className="text-4xl font-light text-academic-green mb-2 font-serif italic">Welcome Back</h1>
                <p className="text-academic-green/70 font-serif">Log in to Sahayak to contribute.</p>
            </div>

            {error && (
                <div className="bg-red-500/10 border-l-4 border-red-500 text-red-700 p-3 mb-6 text-sm text-center font-sans tracking-wide">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-xs font-bold font-sans tracking-widest uppercase text-academic-green mb-2">Email Address</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/50 border-b-2 border-academic-gold/30 px-4 py-2.5 text-academic-green placeholder-academic-green/40 focus:outline-none focus:border-academic-green focus:bg-white transition-all font-serif italic"
                        placeholder="you@university.edu"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold font-sans tracking-widest uppercase text-academic-green mb-2">Password</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white/50 border-b-2 border-academic-gold/30 px-4 py-2.5 text-academic-green placeholder-academic-green/40 focus:outline-none focus:border-academic-green focus:bg-white transition-all font-serif italic"
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-academic-green text-academic-cream py-3.5 flex justify-center mt-8 uppercase tracking-widest font-bold text-xs rounded hover:bg-academic-green/90 transition-all font-sans"
                >
                    {isLoading ? (
                        <div className="w-4 h-4 border-2 border-academic-cream/30 border-t-academic-cream rounded-full animate-spin"></div>
                    ) : (
                        "Log In"
                    )}
                </button>
            </form>

            <div className="mt-8 text-center text-sm font-serif italic text-academic-green/70">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-academic-green font-bold not-italic font-sans text-xs tracking-widest uppercase hover:text-academic-gold transition-colors ml-2">
                    Sign up
                </Link>
            </div>
        </div>
    );
}
