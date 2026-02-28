import TeamList from "@/components/TeamList";

interface Subject {
    id: string;
    name: string;
    slug: string;
    course: { department: string; semester: number; course_id: string };
    authors?: { user_id: string; display_name: string }[];
}

interface Contributor {
    user_id: string;
    display_name: string;
    subjects: {
        id: string;
        name: string;
        slug: string;
        course: { department: string; semester: number; course_id: string };
    }[];
}

async function getTeamData(): Promise<Contributor[]> {
    try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const res = await fetch(`${API_URL}/subjects`, { cache: "no-store", next: { revalidate: 0 } });
        if (!res.ok) return [];

        const subjects: Subject[] = await res.json();
        const contributorsMap = new Map<string, Contributor>();

        subjects.forEach(subject => {
            const authors = subject.authors || [];
            authors.forEach(author => {
                if (!contributorsMap.has(author.user_id)) {
                    contributorsMap.set(author.user_id, {
                        user_id: author.user_id,
                        display_name: author.display_name,
                        subjects: []
                    });
                }
                contributorsMap.get(author.user_id)!.subjects.push({
                    id: subject.id,
                    name: subject.name,
                    slug: subject.slug,
                    course: subject.course
                });
            });
        });

        // Convert to array and sort by number of contributions descending
        return Array.from(contributorsMap.values()).sort((a, b) => b.subjects.length - a.subjects.length);

    } catch (err) {
        console.error("Error fetching team data:", err);
        return [];
    }
}

export const metadata = { title: "Contributors - Sahayak" };

export default async function ContributorsPage() {
    const contributors = await getTeamData();

    return (
        <main className="flex-1 text-academic-green">
            <header className="max-w-4xl mx-auto px-8 py-20 text-center w-full">
                <div className="mb-4 flex justify-center">
                    <div className="h-px w-16 bg-academic-gold self-center"></div>
                    <span className="mx-4 text-academic-gold italic uppercase tracking-[0.3em] text-xs font-bold font-sans">Scholars</span>
                    <div className="h-px w-16 bg-academic-gold self-center"></div>
                </div>

                <h1 className="text-5xl md:text-6xl font-light mb-6 italic font-serif">Hall of Contributors</h1>
                <p className="text-academic-green/80 font-serif text-lg max-w-2xl mx-auto leading-relaxed">
                    Honoring the dedicated scholars and students who have transcribed their academic knowledge to build the Sahayak Library.
                </p>
            </header>

            <TeamList contributors={contributors} />
        </main>
    );
}
