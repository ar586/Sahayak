"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccessMsg("");

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
            const res = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    display_name: displayName,
                    role: "contributor" // Default role
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.detail || "Registration failed");
            }

            setSuccessMsg("Registration successful! Redirecting to login...");
            setTimeout(() => {
                router.push("/login");
            }, 1500);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-8 glass-panel rounded-2xl">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                <p className="text-slate-400">Join Sahayak to share your knowledge.</p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
                    {error}
                </div>
            )}

            {successMsg && (
                <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-lg mb-6 text-sm text-center">
                    {successMsg}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Username</label>
                    <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-surface-hover/50 border border-border rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono"
                        placeholder="johndoe123"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Display Name</label>
                    <input
                        type="text"
                        required
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full bg-surface-hover/50 border border-border rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        placeholder="John Doe"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-surface-hover/50 border border-border rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        placeholder="you@university.edu"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                    <input
                        type="password"
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-surface-hover/50 border border-border rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading || !!successMsg}
                    className="w-full btn-primary py-2.5 flex justify-center mt-6"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        "Create Account"
                    )}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-400">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                    Log in
                </Link>
            </div>
        </div>
    );
}
