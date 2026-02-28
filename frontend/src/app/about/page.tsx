import { BookOpen, Users, Code, Mail, Linkedin } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About - Sahayak",
    description: "Learn about Sahayak, the curated repository of academic knowledge for discerning students.",
};

export default function AboutPage() {
    return (
        <main className="flex-1 text-academic-green">
            <header className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-20 text-center w-full">
                <div className="mb-4 flex justify-center">
                    <div className="h-px w-12 md:w-16 bg-academic-gold self-center"></div>
                    <span className="mx-3 md:mx-4 text-academic-gold italic uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-xs font-bold font-sans">Genesis</span>
                    <div className="h-px w-12 md:w-16 bg-academic-gold self-center"></div>
                </div>

                <h1 className="text-4xl md:text-6xl font-light mb-4 md:mb-6 italic font-serif">About Sahayak</h1>
                <p className="text-academic-green/80 font-serif text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                    A curated repository of academic knowledge designed to demystify college semantics for the discerning student.No more cold dm'ing to seniors and no more deciphering their confusing replies.
                </p>
            </header>

            <section className="max-w-4xl mx-auto px-4 md:px-8 mb-16 md:mb-24">
                <div className="encyclopedia-card p-6 md:p-14 border border-border bg-white shadow-sm rounded">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6 font-serif border-b-2 border-academic-gold inline-block pr-8 md:pr-12 pb-2">The Philosophy</h2>
                    <div className="justified-text text-base md:text-lg leading-relaxed text-slate-800 font-serif space-y-6">
                        <p>
                            Sahayak ("Helper/Assistant" in Sanskrit) was born out of a stark realization: the transition into higher academic realms is often cluttered with unorganized data, fragmented syllabi, and a serious lack of strategic foresight.
                        </p>
                        <p>
                            We built this platform to act as an open-source academic encyclopedia. By crowdsourcing critical insights—from mid-semester strategies and grading rubrics to scholarly literature and previous-year question papers—Sahayak transforms institutional tribal knowledge into an accessible, elegant, and permanently enduring ledger.
                        </p>
                    </div>
                </div>
            </section>

            <section className="max-w-5xl mx-auto px-4 md:px-8 mb-16 md:mb-24">
                <div className="ornament mb-8 md:mb-12 text-xl md:text-2xl font-serif italic text-academic-gold text-center">Architects of Sahayak</div>

                <div className="grid md:grid-cols-2 gap-8 md:gap-10">
                    <div className="encyclopedia-card group hover:border-academic-green transition-all p-6 md:p-10 relative overflow-hidden flex flex-col items-center text-center bg-white shadow-sm rounded">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-academic-gold"></div>
                        <div className="w-20 md:w-24 h-20 md:h-24 bg-academic-parchment rounded-full border-2 border-academic-gold/30 flex items-center justify-center mb-4 md:mb-6 text-academic-gold transition-colors overflow-hidden">
                            <img src="/aryan.jpeg" alt="Aryan Anand" className="w-full h-full object-cover shadow-inner" />
                        </div>
                        <div className="flex items-center gap-2 md:gap-3 mb-1">
                            <h3 className="text-xl md:text-2xl font-bold font-serif">Aryan Anand</h3>
                            <a href="https://www.linkedin.com/in/aryan-anand-4aba06309/" target="_blank" rel="noopener noreferrer" className="text-academic-gold hover:text-academic-green transition-colors">
                                <Linkedin size={20} className="w-5 h-5 md:w-auto md:h-auto" />
                            </a>
                        </div>
                        <p className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-slate-500 mb-4 md:mb-6 font-sans">Creator & Lead Architect</p>
                        <p className="font-serif text-sm md:text-base text-slate-700 leading-relaxed max-w-sm">
                            The driving force behind Sahayak, engineering the core infrastructure and designing its signature academic aesthetic to empower the next generation of scholars.
                        </p>
                    </div>

                    <div className="encyclopedia-card group hover:border-academic-green transition-all p-6 md:p-10 relative overflow-hidden flex flex-col items-center text-center bg-white shadow-sm rounded">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-academic-green"></div>
                        <div className="w-20 md:w-24 h-20 md:h-24 bg-academic-parchment rounded-full border-2 border-academic-green/30 flex items-center justify-center mb-4 md:mb-6 text-academic-green transition-colors overflow-hidden">
                            <img src="/manish.jpeg" alt="Manish Mittal" className="w-full h-full object-cover shadow-inner" />
                        </div>
                        <div className="flex items-center gap-2 md:gap-3 mb-1">
                            <h3 className="text-xl md:text-2xl font-bold font-serif">Manish Mittal</h3>
                            <a href="https://www.linkedin.com/in/manish-a477b4317" target="_blank" rel="noopener noreferrer" className="text-academic-green hover:text-academic-gold transition-colors opacity-80 hover:opacity-100">
                                <Linkedin size={20} className="w-5 h-5 md:w-auto md:h-auto" />
                            </a>
                        </div>
                        <p className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-slate-500 mb-4 md:mb-6 font-sans">Content Manager</p>
                        <p className="font-serif text-sm md:text-base text-slate-700 leading-relaxed max-w-sm">
                            With his immense academic knowledge and experience, he has been instrumental in shaping the platform's vision, structuring the educational taxonomy, and curating the foundational library of subjects.He is currently ranked 11th in department with a massive 8.8 cgpa.
                        </p>
                    </div>
                </div>
            </section>

            <section className="max-w-4xl mx-auto px-4 md:px-8 mb-20 md:mb-32 text-center">
                <div className="bg-academic-green text-academic-cream p-6 md:p-12 rounded-custom shadow-lg relative overflow-hidden">
                    <div className="absolute opacity-10 -right-10 -bottom-10">
                        <BookOpen size={200} className="w-32 h-32 md:w-[200px] md:h-[200px]" />
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-2xl md:text-3xl font-bold font-serif mb-3 md:mb-4 text-academic-gold">Special Acknowledgements</h2>
                        <div className="h-px w-16 md:w-24 bg-academic-gold/50 mx-auto mb-6 md:mb-8"></div>
                        <p className="font-serif text-sm md:text-lg leading-relaxed text-academic-cream/90 max-w-xl mx-auto mb-6">
                            Sahayak’s rapid development and technical stability would not have been possible without the invaluable technical support and rigorous debugging provided by our peer.
                        </p>

                        <div className="inline-block bg-academic-cream/10 px-6 md:px-8 py-3 md:py-4 rounded-custom border border-academic-gold/30">
                            <div className="flex items-center justify-center gap-2 md:gap-3">
                                <h3 className="text-xl md:text-2xl font-bold font-serif text-white">Sujal Chaudhary</h3>
                                <a href="https://sujal.info/linkedin" target="_blank" rel="noopener noreferrer" className="text-academic-gold hover:text-white transition-colors flex-shrink-0">
                                    <Linkedin size={20} className="w-5 h-5 md:w-auto md:h-auto" />
                                </a>
                            </div>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-academic-gold font-sans mt-1">Technical Advisor</p>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    );
} 
