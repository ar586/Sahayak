import { BookOpen, Users, Code, Mail } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About - Sahayak",
    description: "Learn about Sahayak, the curated repository of academic knowledge for discerning students.",
};

export default function AboutPage() {
    return (
        <main className="flex-1 text-academic-green">
            <header className="max-w-4xl mx-auto px-8 py-20 text-center w-full">
                <div className="mb-4 flex justify-center">
                    <div className="h-px w-16 bg-academic-gold self-center"></div>
                    <span className="mx-4 text-academic-gold italic uppercase tracking-[0.3em] text-xs font-bold font-sans">Genesis</span>
                    <div className="h-px w-16 bg-academic-gold self-center"></div>
                </div>

                <h1 className="text-5xl md:text-6xl font-light mb-6 italic font-serif">About Sahayak</h1>
                <p className="text-academic-green/80 font-serif text-lg max-w-2xl mx-auto leading-relaxed">
                    A curated repository of academic knowledge designed to demystify college semantics for the discerning student.No more cold dm'ing to seniors and no more deciphering their confusing replies.
                </p>
            </header>

            <section className="max-w-4xl mx-auto px-8 mb-24">
                <div className="encyclopedia-card p-10 md:p-14 border border-border bg-white shadow-sm rounded">
                    <h2 className="text-3xl font-bold mb-6 font-serif border-b-2 border-academic-gold w-max pr-12 pb-2">The Philosophy</h2>
                    <div className="justified-text text-lg leading-relaxed text-slate-800 font-serif space-y-6">
                        <p>
                            Sahayak ("Helper/Assistant" in Sanskrit) was born out of a stark realization: the transition into higher academic realms is often cluttered with unorganized data, fragmented syllabi, and a serious lack of strategic foresight.
                        </p>
                        <p>
                            We built this platform to act as an open-source academic encyclopedia. By crowdsourcing critical insights—from mid-semester strategies and grading rubrics to scholarly literature and previous-year question papers—Sahayak transforms institutional tribal knowledge into an accessible, elegant, and permanently enduring ledger.
                        </p>
                    </div>
                </div>
            </section>

            <section className="max-w-5xl mx-auto px-8 mb-24">
                <div className="ornament mb-12 text-2xl font-serif italic text-academic-gold text-center">Architects of Sahayak</div>

                <div className="grid md:grid-cols-2 gap-10">
                    <div className="encyclopedia-card group hover:border-academic-green transition-all p-10 relative overflow-hidden flex flex-col items-center text-center bg-white shadow-sm rounded">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-academic-gold"></div>
                        <div className="w-24 h-24 bg-academic-parchment rounded-full border-2 border-academic-gold/30 flex items-center justify-center mb-6 text-academic-gold transition-colors overflow-hidden">
                            <img src="/aryan.jpeg" alt="Aryan Anand" className="w-full h-full object-cover shadow-inner" />
                        </div>
                        <h3 className="text-2xl font-bold font-serif mb-1">Aryan Anand</h3>
                        <p className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-6 font-sans">Creator & Lead Architect</p>
                        <p className="font-serif text-slate-700 leading-relaxed max-w-sm">
                            The driving force behind Sahayak, engineering the core infrastructure and designing its signature academic aesthetic to empower the next generation of scholars.
                        </p>
                    </div>

                    <div className="encyclopedia-card group hover:border-academic-green transition-all p-10 relative overflow-hidden flex flex-col items-center text-center bg-white shadow-sm rounded">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-academic-green"></div>
                        <div className="w-24 h-24 bg-academic-parchment rounded-full border-2 border-academic-green/30 flex items-center justify-center mb-6 text-academic-green transition-colors overflow-hidden">
                            <img src="/manish.jpeg" alt="Manish Mittal" className="w-full h-full object-cover shadow-inner" />
                        </div>
                        <h3 className="text-2xl font-bold font-serif mb-1">Manish Mittal</h3>
                        <p className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-6 font-sans">Content Manager</p>
                        <p className="font-serif text-slate-700 leading-relaxed max-w-sm">
                            With his immense academic knowledge and experience, he has been instrumental in shaping the platform's vision, structuring the educational taxonomy, and curating the foundational library of subjects.He is currently ranked 11th in department with a massive 8.8 cgpa.
                        </p>
                    </div>
                </div>
            </section>

            <section className="max-w-4xl mx-auto px-8 mb-32 text-center">
                <div className="bg-academic-green text-academic-cream p-12 rounded-custom shadow-lg relative overflow-hidden">
                    <div className="absolute opacity-10 -right-10 -bottom-10">
                        <BookOpen size={200} />
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold font-serif mb-4 text-academic-gold">Special Acknowledgements</h2>
                        <div className="h-px w-24 bg-academic-gold/50 mx-auto mb-8"></div>
                        <p className="font-serif text-lg leading-relaxed text-academic-cream/90 max-w-xl mx-auto mb-6">
                            Sahayak’s rapid development and technical stability would not have been possible without the invaluable technical support and rigorous debugging provided by our peer.
                        </p>

                        <div className="inline-block bg-academic-cream/10 px-8 py-4 rounded-custom border border-academic-gold/30">
                            <h3 className="text-2xl font-bold font-serif text-white">Sujal Chaudhary</h3>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-academic-gold font-sans mt-1">Technical Advisor</p>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    );
} 
