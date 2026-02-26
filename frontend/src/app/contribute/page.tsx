"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const InputField = ({ label, value, onChange, placeholder, type = "text", required = true }: any) => (
    <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <input
            type={type}
            required={required}
            value={value}
            onChange={onChange}
            className="w-full bg-surface-hover/50 border border-border rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono text-sm"
            placeholder={placeholder}
        />
    </div>
);

const SelectField = ({ label, value, onChange, options }: any) => (
    <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <select
            value={value}
            onChange={onChange}
            className="w-full bg-surface-hover/50 border border-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono text-sm capitalize"
        >
            {options.map((opt: string) => (
                <option key={opt} value={opt} className="bg-surface text-white capitalize">{opt}</option>
            ))}
        </select>
    </div>
);

const TextAreaField = ({ label, value, onChange, placeholder, rows = 4, helpText = "" }: any) => (
    <div>
        <div className="flex justify-between items-end mb-1">
            <label className="block text-sm font-medium text-slate-300">{label}</label>
            {helpText && <span className="text-xs text-slate-500">{helpText}</span>}
        </div>
        <textarea
            required
            rows={rows}
            value={value}
            onChange={onChange}
            className="w-full bg-surface-hover/50 border border-border rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-mono resize-y"
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
        department: ""
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
        { unit_number: 1, title: "", unit_difficulty: "moderate", scoring_value: "medium", skip_safe: false, topics: [""] }
    ]);

    const [strategies, setStrategies] = useState({
        midsem_strategy: "",
        endsem_strategy: ""
    });

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
            skip_safe: false,
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
            const res = await fetch("http://127.0.0.1:8000/subjects", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || "Failed to submit subject");

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
            <div className="max-w-2xl mx-auto mt-20 p-8 glass-panel rounded-2xl text-center">
                <h2 className="text-3xl font-bold text-green-400 mb-4">Subject Submitted!</h2>
                <p className="text-slate-300">
                    Thank you for contributing to Sahayak! Your subject guide is currently pending review by an admin.
                    Once approved, it will appear on the homepage.
                </p>
                <button onClick={() => router.push("/")} className="mt-8 btn-primary px-6 py-2">
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Contribute a Subject</h1>
                <p className="text-slate-400">Share your complete, unit-by-unit guide to help others ace this subject.</p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {/* Progress Bar */}
            <div className="flex gap-2 mb-8">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className={`h-2 flex-1 rounded-full ${step >= i ? 'bg-primary' : 'bg-surface-hover'}`} />
                ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 glass-panel p-8 rounded-2xl">
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <h2 className="text-2xl font-bold text-white border-b border-border pb-3">1. Basic Information</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <InputField label="Subject Name" value={name} onChange={(e: any) => setName(e.target.value)} placeholder="e.g. Probability and Statistics" />
                            <InputField label="URL Slug" value={slug} onChange={(e: any) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))} placeholder="probability-and-statistics" />
                            <InputField label="Course ID" value={course.course_id} onChange={(e: any) => setCourse({ ...course, course_id: e.target.value })} placeholder="e.g. MA301" />
                            <InputField label="Course Name" value={course.course_name} onChange={(e: any) => setCourse({ ...course, course_name: e.target.value })} placeholder="e.g. B.Tech" />
                            <InputField label="Department" value={course.department} onChange={(e: any) => setCourse({ ...course, department: e.target.value })} placeholder="e.g. CSE" />
                            <InputField label="Semester" type="number" value={course.semester.toString()} onChange={(e: any) => setCourse({ ...course, semester: parseInt(e.target.value) || 1 })} placeholder="3" />
                        </div>
                        <InputField label="Banner Image URL" required={false} value={syllabusImageUrl} onChange={(e: any) => setSyllabusImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" />
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <h2 className="text-2xl font-bold text-white border-b border-border pb-3">2. Overview & Difficulty</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <SelectField label="Overall Difficulty" value={overview.overall_difficulty} onChange={(e: any) => setOverview({ ...overview, overall_difficulty: e.target.value })} options={['easy', 'moderate', 'hard']} />
                            <SelectField label="Nature of Subject" value={overview.nature_type} onChange={(e: any) => setOverview({ ...overview, nature_type: e.target.value })} options={['theory', 'practical', 'mixed']} />
                            <SelectField label="Time Required to Prep" value={overview.time_required} onChange={(e: any) => setOverview({ ...overview, time_required: e.target.value })} options={['low', 'medium', 'high']} />
                            <SelectField label="Scoring Potential" value={overview.scoring_potential} onChange={(e: any) => setOverview({ ...overview, scoring_potential: e.target.value })} options={['low', 'medium', 'high']} />
                            <SelectField label="Risk Level (Chance of failing)" value={overview.risk_level} onChange={(e: any) => setOverview({ ...overview, risk_level: e.target.value })} options={['low', 'moderate', 'high']} />
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <h2 className="text-2xl font-bold text-white border-b border-border pb-3">3. Introduction & Tips</h2>
                        <TextAreaField label="About the Subject" value={intro.about_subject} onChange={(e: any) => setIntro({ ...intro, about_subject: e.target.value })} placeholder="Briefly describe what this subject is about and its reputation..." />
                        <TextAreaField label="General Tips" value={intro.general_tips} onChange={(e: any) => setIntro({ ...intro, general_tips: e.target.value })} placeholder="What's the best way to study for this? e.g. 'Practice PYQs heavily'" />
                        <TextAreaField label="Things to Keep in Mind" value={intro.things_to_keep_in_mind} onChange={(e: any) => setIntro({ ...intro, things_to_keep_in_mind: e.target.value })} placeholder="Crucial warnings. e.g. 'Do not skip unit 4, it carries 40% weightage.'" />
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                        <h2 className="text-2xl font-bold text-white border-b border-border pb-3">4. Unit Breakdowns</h2>

                        {units.map((unit, uIdx) => (
                            <div key={uIdx} className="p-6 bg-surface border border-border rounded-xl space-y-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold text-white">Unit {unit.unit_number}</h3>
                                    {units.length > 1 && (
                                        <button type="button" onClick={() => setUnits(units.filter((_, i) => i !== uIdx))} className="text-red-400 text-sm hover:underline">Remove Unit</button>
                                    )}
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <InputField label="Unit Title" value={unit.title} onChange={(e: any) => handleUnitChange(uIdx, 'title', e.target.value)} placeholder="e.g. Important Theoretical Distributions" />
                                    <div className="flex items-center gap-4 mt-8">
                                        <label className="flex items-center gap-2 text-sm text-slate-300">
                                            <input type="checkbox" checked={unit.skip_safe} onChange={(e) => handleUnitChange(uIdx, 'skip_safe', e.target.checked)} className="rounded border-slate-600 bg-surface text-primary focus:ring-primary/50" />
                                            Is it safe to skip this unit?
                                        </label>
                                    </div>
                                    <SelectField label="Unit Difficulty" value={unit.unit_difficulty} onChange={(e: any) => handleUnitChange(uIdx, 'unit_difficulty', e.target.value)} options={['easy', 'moderate', 'hard']} />
                                    <SelectField label="Scoring Value" value={unit.scoring_value} onChange={(e: any) => handleUnitChange(uIdx, 'scoring_value', e.target.value)} options={['low', 'medium', 'high']} />
                                </div>

                                <div className="space-y-3 pt-4 border-t border-border">
                                    <label className="block text-sm font-medium text-slate-300">Important Topics (Markdown Supported)</label>
                                    {unit.topics.map((topic, tIdx) => (
                                        <div key={tIdx} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={topic}
                                                onChange={(e) => handleTopicChange(uIdx, tIdx, e.target.value)}
                                                className="w-full bg-surface-hover/50 border border-border rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                                                placeholder={`e.g. **Topic Name** - Description of what to study.`}
                                            />
                                            {unit.topics.length > 1 && (
                                                <button type="button" onClick={() => removeTopic(uIdx, tIdx)} className="px-3 text-slate-400 hover:text-red-400 transition-colors">✕</button>
                                            )}
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => addTopic(uIdx)} className="text-sm text-primary hover:text-primary-hover font-medium mt-2">+ Add another topic</button>
                                </div>
                            </div>
                        ))}

                        <button type="button" onClick={addUnit} className="w-full py-4 border-2 border-dashed border-border rounded-xl text-slate-400 hover:text-white hover:border-slate-500 transition-colors font-medium">
                            + Add Unit {units.length + 1}
                        </button>
                    </div>
                )}

                {step === 5 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <h2 className="text-2xl font-bold text-white border-b border-border pb-3">5. Exam Strategies & Resources</h2>
                        <TextAreaField
                            label="Midsem Strategy"
                            value={strategies.midsem_strategy}
                            onChange={(e: any) => setStrategies({ ...strategies, midsem_strategy: e.target.value })}
                            placeholder="List important topics for mid-terms..."
                            helpText="Markdown supported"
                        />
                        <TextAreaField
                            label="Endsem Strategy"
                            value={strategies.endsem_strategy}
                            onChange={(e: any) => setStrategies({ ...strategies, endsem_strategy: e.target.value })}
                            placeholder="List important topics for end-terms..."
                            helpText="Markdown supported"
                        />

                        <div className="pt-6 border-t border-border mt-6">
                            <h3 className="text-xl font-bold text-white mb-4">Previous Year Questions (PYQs)</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <InputField required={false} label="Midsem PYQ Image URL" value={midsemPyqUrl} onChange={(e: any) => setMidsemPyqUrl(e.target.value)} placeholder="https://example.com/midsem.jpg" />
                                <InputField required={false} label="Endsem PYQ Image URL" value={endsemPyqUrl} onChange={(e: any) => setEndsemPyqUrl(e.target.value)} placeholder="https://example.com/endsem.jpg" />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-border mt-6">
                            <h3 className="text-xl font-bold text-white mb-4">Study Materials & Notes</h3>
                            <div className="space-y-4">
                                {materials.map((mat, idx) => (
                                    <div key={idx} className="flex flex-col md:flex-row gap-4 items-end bg-surface p-4 rounded-xl border border-border">
                                        <div className="flex-1 w-full"><InputField required={false} label="Title" value={mat.title} onChange={(e: any) => handleMaterialChange(idx, 'title', e.target.value)} placeholder="e.g. Unit 3 Handwritten Notes" /></div>
                                        <div className="flex-1 w-full"><InputField required={false} label="URL Link" value={mat.url} onChange={(e: any) => handleMaterialChange(idx, 'url', e.target.value)} placeholder="https://drive.google.com/..." /></div>
                                        <div className="w-full md:w-40"><SelectField label="Type" value={mat.type} onChange={(e: any) => handleMaterialChange(idx, 'type', e.target.value)} options={['document', 'video', 'link']} /></div>
                                        {materials.length > 1 && (
                                            <button type="button" onClick={() => removeMaterial(idx)} className="pb-3 px-2 text-slate-400 hover:text-red-400 transition-colors">✕</button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={addMaterial} className="text-sm text-primary hover:text-primary-hover font-medium">+ Add Material</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t border-border">
                    <button
                        type="button"
                        onClick={() => setStep(step - 1)}
                        disabled={step === 1 || isSubmitting}
                        className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${step === 1 ? 'opacity-0 pointer-events-none' : 'bg-surface-hover text-white hover:bg-surface-hover/80'}`}
                    >
                        Back
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary px-8 py-2.5 flex items-center gap-2 font-medium"
                    >
                        {isSubmitting ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : step < 5 ? (
                            "Next Step →"
                        ) : (
                            "Submit Subject"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
