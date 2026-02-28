"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { DEPARTMENTS } from "@/lib/constants";

const InputField = ({ label, value, onChange, placeholder, type = "text", required = true }: any) => (
    <div>
        <label className="block font-sans uppercase text-[10px] tracking-widest font-bold text-slate-500 mb-1">{label}</label>
        <input
            type={type}
            required={required}
            value={value}
            onChange={onChange}
            className="w-full bg-academic-parchment/30 border-b-2 border-academic-gold/30 px-4 py-3 text-academic-green focus:outline-none focus:border-academic-green transition-colors font-serif placeholder-slate-400"
            placeholder={placeholder}
        />
    </div>
);

const SelectField = ({ label, value, onChange, options }: any) => (
    <div>
        <label className="block font-sans uppercase text-[10px] tracking-widest font-bold text-slate-500 mb-1">{label}</label>
        <select
            value={value}
            onChange={onChange}
            className="w-full bg-academic-parchment/30 border-b-2 border-academic-gold/30 px-4 py-3 text-academic-green focus:outline-none focus:border-academic-green transition-colors font-serif capitalize"
        >
            {options.map((opt: string) => (
                <option key={opt} value={opt} className="bg-white text-academic-green capitalize">{opt}</option>
            ))}
        </select>
    </div>
);

const TextAreaField = ({ label, value, onChange, placeholder, rows = 4, helpText = "" }: any) => (
    <div>
        <div className="flex justify-between items-end mb-1">
            <label className="block font-sans uppercase text-[10px] tracking-widest font-bold text-slate-500">{label}</label>
            {helpText && <span className="text-[10px] text-slate-400 uppercase tracking-widest font-sans">{helpText}</span>}
        </div>
        <textarea
            required
            rows={rows}
            value={value}
            onChange={onChange}
            className="w-full bg-academic-parchment/30 border-b-2 border-academic-gold/30 px-4 py-3 text-academic-green focus:outline-none focus:border-academic-green transition-colors font-serif resize-none placeholder-slate-400"
            placeholder={placeholder}
        />
    </div>
);

export default function ContributeSubjectPage() {
    const { user, token, loading } = useAuth();
    const router = useRouter();

    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [syllabusImageUrl, setSyllabusImageUrl] = useState("");
    const [midsemPyqUrl, setMidsemPyqUrl] = useState("");
    const [endsemPyqUrl, setEndsemPyqUrl] = useState("");
    const [materials, setMaterials] = useState([
        { title: "", url: "", type: "link" }
    ]);

    const [course, setCourse] = useState({
        course_id: "",
        course_name: "",
        semester: 1,
        department: DEPARTMENTS[0].shortName
    });

    const [overview, setOverview] = useState({
        overall_difficulty: "moderate",
        nature_type: "mixed",
        time_required: "medium",
        scoring_potential: "medium",
        risk_level: "moderate"
    });

    const [intro, setIntro] = useState({
        about_subject: "",
        general_tips: "",
        things_to_keep_in_mind: ""
    });

    const [units, setUnits] = useState([
        { unit_number: 1, title: "", unit_difficulty: "moderate", scoring_value: "medium", topics: [""] }
    ]);

    const [strategies, setStrategies] = useState({
        midsem_strategy: "",
        endsem_strategy: ""
    });

    const STORAGE_KEY = "sahayak_contribute_form_v2";

    // Hydrate form from local storage
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.step) setStep(parsed.step);
                if (parsed.name) setName(parsed.name);
                if (parsed.slug) setSlug(parsed.slug);
                if (parsed.syllabusImageUrl) setSyllabusImageUrl(parsed.syllabusImageUrl);
                if (parsed.midsemPyqUrl) setMidsemPyqUrl(parsed.midsemPyqUrl);
                if (parsed.endsemPyqUrl) setEndsemPyqUrl(parsed.endsemPyqUrl);
                if (parsed.materials) setMaterials(parsed.materials);
                if (parsed.course) setCourse(parsed.course);
                if (parsed.overview) setOverview(parsed.overview);
                if (parsed.intro) setIntro(parsed.intro);
                if (parsed.units) setUnits(parsed.units);
                if (parsed.strategies) setStrategies(parsed.strategies);
            } catch (e) {
                console.error("Failed to parse saved form data", e);
            }
        }
    }, []);

    // Sync form state to local storage
    useEffect(() => {
        const dataToSave = {
            step, name, slug, syllabusImageUrl, midsemPyqUrl, endsemPyqUrl,
            materials, course, overview, intro, units, strategies
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }, [step, name, slug, syllabusImageUrl, midsemPyqUrl, endsemPyqUrl, materials, course, overview, intro, units, strategies]);

    // Redirect if not logged in
    if (!loading && !user) {
        router.push("/login");
        return null;
    }

    const handleUnitChange = (index: number, field: string, value: any) => {
        const newUnits = [...units];
        newUnits[index] = { ...newUnits[index], [field]: value };
        setUnits(newUnits);
    };

    const handleTopicChange = (unitIndex: number, topicIndex: number, value: string) => {
        const newUnits = [...units];
        const newTopics = [...newUnits[unitIndex].topics];
        newTopics[topicIndex] = value;
        newUnits[unitIndex].topics = newTopics;
        setUnits(newUnits);
    };

    const addTopic = (unitIndex: number) => {
        const newUnits = [...units];
        newUnits[unitIndex].topics.push("");
        setUnits(newUnits);
    };

    const removeTopic = (unitIndex: number, topicIndex: number) => {
        const newUnits = [...units];
        newUnits[unitIndex].topics.splice(topicIndex, 1);
        setUnits(newUnits);
    };

    const addUnit = () => {
        setUnits([...units, {
            unit_number: units.length + 1,
            title: "",
            unit_difficulty: "moderate",
            scoring_value: "medium",
            topics: [""]
        }]);
    };

    const handleMaterialChange = (index: number, field: string, value: string) => {
        const newMats = [...materials];
        newMats[index] = { ...newMats[index], [field]: value };
        setMaterials(newMats);
    };

    const addMaterial = () => {
        setMaterials([...materials, { title: "", url: "", type: "link" }]);
    };

    const removeMaterial = (index: number) => {
        const newMats = [...materials];
        newMats.splice(index, 1);
        setMaterials(newMats);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (step < 5) {
            setStep(step + 1);
            return;
        }

        setIsSubmitting(true);
        setError("");

        // Filter out empty topics before submitting
        const cleanedUnits = units.map(u => ({
            ...u,
            topics: u.topics.filter(t => t.trim() !== "")
        }));

        const cleanedMaterials = materials.filter(m => m.title.trim() !== "" && m.url.trim() !== "");

        const payload = {
            name,
            slug,
            syllabus_image_url: syllabusImageUrl,
            midsem_pyq_url: midsemPyqUrl,
            endsem_pyq_url: endsemPyqUrl,
            materials: cleanedMaterials,
            course,
            overview,
            intro,
            units: cleanedUnits,
            study_modes: { one_day: "", three_day: "", full_prep: "", nine_plus_mode: "" },
            midsem_strategy: strategies.midsem_strategy,
            endsem_strategy: strategies.endsem_strategy
        };

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
            const res = await fetch(`${API_URL}/subjects`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || "Failed to submit subject");

            localStorage.removeItem(STORAGE_KEY);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="text-center py-20">Loading...</div>;

    if (success) {
        return (
            <div className="max-w-[800px] mx-auto px-4 py-20 text-center text-academic-green mt-12 mb-24 encyclopedia-card shadow-sm rounded border border-border">
                <div className="w-16 h-16 mx-auto mb-6 bg-green-100 text-green-700 flex items-center justify-center rounded-full border border-green-200">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h2 className="text-4xl font-extrabold font-display mb-4">Contribution Received</h2>
                <p className="text-lg font-serif italic mb-8 max-w-xl mx-auto">
                    Your scholastic entry has been submitted to the archives. It is currently pending review by a curator and will be published upon approval.
                </p>
                <div className="flex justify-center">
                    <button onClick={() => router.push("/dashboard")} className="border-2 border-academic-green bg-academic-green text-academic-parchment hover:bg-transparent hover:text-academic-green px-8 py-3 font-bold uppercase tracking-widest text-xs transition-all rounded shadow-sm inline-block">
                        Return to Ledger
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[800px] mx-auto px-4 py-12 text-academic-green pb-24">

            <header className="mb-10 pb-6 border-b-2 border-academic-gold/30 flex flex-col items-center text-center">
                <p className="uppercase tracking-widest text-xs mb-2 opacity-70 font-sans font-bold">New Archive Entry</p>
                <h1 className="text-4xl md:text-5xl font-extrabold font-display">Scholarly Submission</h1>
            </header>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-8 font-serif italic flex items-start">
                    <svg className="w-5 h-5 mr-3 mt-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <p>{error}</p>
                </div>
            )}

            {/* Progress Bar */}
            <div className="flex gap-2 mb-8">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className={`h-2 flex-1 rounded-sm ${step >= i ? 'bg-academic-green' : 'bg-slate-200 border border-border'}`} />
                ))}
            </div>

            <form onSubmit={handleSubmit} className="encyclopedia-card p-6 md:p-10 shadow-sm rounded border border-border bg-white">
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <h2 className="text-2xl font-bold font-serif italic text-academic-gold border-b-2 border-academic-green/20 pb-2 mb-6">Article I: Nomenclature & Origin</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <InputField label="Subject Name" value={name} onChange={(e: any) => setName(e.target.value)} placeholder="e.g. Probability and Statistics" />
                            <InputField label="URL Slug" value={slug} onChange={(e: any) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))} placeholder="probability-and-statistics" />
                            <InputField label="Course Identifier" value={course.course_id} onChange={(e: any) => setCourse({ ...course, course_id: e.target.value })} placeholder="e.g. MA301" />
                            <InputField label="Program Name" value={course.course_name} onChange={(e: any) => setCourse({ ...course, course_name: e.target.value })} placeholder="e.g. B.Tech" />
                            <SelectField label="Department" value={course.department} onChange={(e: any) => setCourse({ ...course, department: e.target.value })} options={DEPARTMENTS.map(d => d.shortName)} />
                            <InputField label="Semester" type="number" value={course.semester.toString()} onChange={(e: any) => setCourse({ ...course, semester: parseInt(e.target.value) || 1 })} placeholder="3" />
                        </div>
                        <InputField label="Illuminating Engraving (Banner URL)" required={false} value={syllabusImageUrl} onChange={(e: any) => setSyllabusImageUrl(e.target.value)} placeholder="https://example.com/illustration.jpg" />
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <h2 className="text-2xl font-bold font-serif italic text-academic-gold border-b-2 border-academic-green/20 pb-2 mb-6">Article II: Scholarly Metrics</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <SelectField label="Overall Difficulty" value={overview.overall_difficulty} onChange={(e: any) => setOverview({ ...overview, overall_difficulty: e.target.value })} options={['easy', 'moderate', 'hard']} />
                            <SelectField label="Nature of Study" value={overview.nature_type} onChange={(e: any) => setOverview({ ...overview, nature_type: e.target.value })} options={['theory', 'practical', 'mixed']} />
                            <SelectField label="Time Engagement" value={overview.time_required} onChange={(e: any) => setOverview({ ...overview, time_required: e.target.value })} options={['low', 'medium', 'high']} />
                            <SelectField label="Scoring Potential" value={overview.scoring_potential} onChange={(e: any) => setOverview({ ...overview, scoring_potential: e.target.value })} options={['low', 'medium', 'high']} />
                            <SelectField label="Risk Factor (Chance of failing)" value={overview.risk_level} onChange={(e: any) => setOverview({ ...overview, risk_level: e.target.value })} options={['low', 'moderate', 'high']} />
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                        <h2 className="text-2xl font-bold font-serif italic text-academic-gold border-b-2 border-academic-green/20 pb-2 mb-6">Article III: Treatise Overview</h2>
                        <TextAreaField label="Subject Abstract" value={intro.about_subject} onChange={(e: any) => setIntro({ ...intro, about_subject: e.target.value })} placeholder="Provide a scholarly synopsis of the subject matter..." />
                        <TextAreaField label="Scholastic Wisdom (Tips)" value={intro.general_tips} onChange={(e: any) => setIntro({ ...intro, general_tips: e.target.value })} placeholder="What pedagogical approach yields best results? e.g. 'Consistent practice of foundational lemmas is paramount.'" />
                        <TextAreaField label="Caveats & Warnings" value={intro.things_to_keep_in_mind} onChange={(e: any) => setIntro({ ...intro, things_to_keep_in_mind: e.target.value })} placeholder="Crucial warnings. e.g. 'Beware ignoring the fourth syllabus division; it forms the examination's foundation.'" />
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                        <h2 className="text-2xl font-bold font-serif italic text-academic-gold border-b-2 border-academic-green/20 pb-2 mb-6">Article IV: Curriculum Breakdown</h2>

                        {units.map((unit, uIdx) => (
                            <div key={uIdx} className="p-6 bg-academic-parchment/20 border border-academic-gold/30 rounded-lg space-y-6 vintage-border shadow-sm">
                                <div className="flex justify-between items-end border-b border-academic-gold/20 pb-2 mb-4">
                                    <h3 className="text-xl font-bold font-serif italic text-academic-green">Chapter {unit.unit_number}</h3>
                                    {units.length > 1 && (
                                        <button type="button" onClick={() => setUnits(units.filter((_, i) => i !== uIdx))} className="text-[10px] font-sans font-bold uppercase tracking-widest text-red-700/70 hover:text-red-700 pb-1 border-b border-transparent hover:border-red-700 transition-colors">Withdraw Chapter</button>
                                    )}
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <InputField label="Chapter Title" value={unit.title} onChange={(e: any) => handleUnitChange(uIdx, 'title', e.target.value)} placeholder="e.g. Fundamental Theorems" />
                                    </div>
                                    <SelectField label="Chapter Difficulty" value={unit.unit_difficulty} onChange={(e: any) => handleUnitChange(uIdx, 'unit_difficulty', e.target.value)} options={['easy', 'moderate', 'hard']} />
                                    <SelectField label="Reward Value" value={unit.scoring_value} onChange={(e: any) => handleUnitChange(uIdx, 'scoring_value', e.target.value)} options={['low', 'medium', 'high']} />
                                </div>

                                <div className="space-y-4 pt-4 mt-2">
                                    <label className="block font-sans uppercase text-[10px] tracking-widest font-bold text-slate-500 mb-2">Key Postulates & Topics</label>
                                    {unit.topics.map((topic, tIdx) => (
                                        <div key={tIdx} className="flex gap-3">
                                            <input
                                                type="text"
                                                value={topic}
                                                onChange={(e) => handleTopicChange(uIdx, tIdx, e.target.value)}
                                                className="w-full bg-white border-b-2 border-academic-gold/30 px-4 py-2 text-academic-green focus:outline-none focus:border-academic-green transition-colors font-serif placeholder-slate-400"
                                                placeholder={`e.g. **Theorem 1** - Essential deduction.`}
                                            />
                                            {unit.topics.length > 1 && (
                                                <button type="button" onClick={() => removeTopic(uIdx, tIdx)} className="px-2 pb-1 text-[10px] font-sans font-bold uppercase tracking-widest text-red-700/50 hover:text-red-700 hover:border-b hover:border-red-700 transition-all">✕</button>
                                            )}
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => addTopic(uIdx)} className="text-[10px] uppercase font-bold tracking-widest text-academic-gold hover:text-academic-green transition-colors font-sans mt-2">+ Append Topic</button>
                                </div>
                            </div>
                        ))}

                        <button type="button" onClick={addUnit} className="w-full py-5 border-2 border-dashed border-academic-gold/50 bg-academic-parchment/10 rounded-lg text-academic-gold hover:text-academic-green hover:border-academic-green hover:bg-academic-parchment/30 transition-all font-sans font-bold uppercase tracking-widest text-[10px]">
                            + Inscribe Next Chapter (Unit {units.length + 1})
                        </button>
                    </div>
                )}

                {step === 5 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                        <h2 className="text-2xl font-bold font-serif italic text-academic-gold border-b-2 border-academic-green/20 pb-2 mb-6">Article V: Examination Strategy & Supplements</h2>
                        <TextAreaField
                            label="Mid-Evaluation Discourse (Midsem Strat)"
                            value={strategies.midsem_strategy}
                            onChange={(e: any) => setStrategies({ ...strategies, midsem_strategy: e.target.value })}
                            placeholder="Detail the tactical approach for mid-term assessments..."
                        />
                        <TextAreaField
                            label="Final Evaluation Discourse (Endsem Strat)"
                            value={strategies.endsem_strategy}
                            onChange={(e: any) => setStrategies({ ...strategies, endsem_strategy: e.target.value })}
                            placeholder="Detail the complete tactical synthesis for final assessments..."
                        />

                        <div className="pt-8 mb-4">
                            <h3 className="text-xl font-bold font-serif italic text-academic-green border-b border-academic-gold/20 pb-2 mb-4">Archived Question Manuscripts</h3>
                            <div className="grid md:grid-cols-2 gap-6 bg-academic-parchment/20 p-6 border border-academic-gold/30 rounded-lg vintage-border shadow-sm">
                                <InputField required={false} label="Midterm Manuscript Image URL" value={midsemPyqUrl} onChange={(e: any) => setMidsemPyqUrl(e.target.value)} placeholder="https://example.com/midsem.jpg" />
                                <InputField required={false} label="Finals Manuscript Image URL" value={endsemPyqUrl} onChange={(e: any) => setEndsemPyqUrl(e.target.value)} placeholder="https://example.com/endsem.jpg" />
                            </div>
                        </div>

                        <div className="pt-4">
                            <h3 className="text-xl font-bold font-serif italic text-academic-green border-b border-academic-gold/20 pb-2 mb-4">Supplementary Literature</h3>
                            <div className="space-y-4">
                                {materials.map((mat, idx) => (
                                    <div key={idx} className="flex flex-col md:flex-row gap-4 items-end bg-academic-parchment/20 border border-academic-gold/30 p-4 rounded-lg vintage-border shadow-sm">
                                        <div className="flex-1 w-full"><InputField required={false} label="Title of Work" value={mat.title} onChange={(e: any) => handleMaterialChange(idx, 'title', e.target.value)} placeholder="e.g. Chapter 3 Faculty Notes" /></div>
                                        <div className="flex-1 w-full"><InputField required={false} label="Locator Link" value={mat.url} onChange={(e: any) => handleMaterialChange(idx, 'url', e.target.value)} placeholder="https://drive.google.com/..." /></div>
                                        <div className="w-full md:w-32"><SelectField label="Format" value={mat.type} onChange={(e: any) => handleMaterialChange(idx, 'type', e.target.value)} options={['document', 'video', 'link']} /></div>
                                        {materials.length > 1 && (
                                            <button type="button" onClick={() => removeMaterial(idx)} className="pb-4 px-2 text-[10px] font-sans font-bold uppercase tracking-widest text-red-700/50 hover:text-red-700 transition-all">✕</button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={addMaterial} className="text-[10px] uppercase font-bold tracking-widest text-academic-gold hover:text-academic-green transition-colors font-sans mt-2 inline-block">+ Append Source</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-8 mt-10 border-t border-academic-gold/30 items-center">
                    <button
                        type="button"
                        onClick={() => setStep(step - 1)}
                        disabled={step === 1 || isSubmitting}
                        className={`font-sans font-bold uppercase text-xs tracking-widest text-slate-500 hover:text-academic-green transition-colors ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}
                    >
                        ← Previous Article
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="border-2 border-academic-green bg-academic-green text-academic-parchment hover:bg-transparent hover:text-academic-green px-8 py-3 font-bold uppercase tracking-widest text-xs transition-all rounded shadow-sm flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                Transcribing...
                            </>
                        ) : step < 5 ? (
                            "Next Article →"
                        ) : (
                            "Seal & Submit"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
