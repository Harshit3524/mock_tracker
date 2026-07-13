"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";

type Exam = "SSC" | "RAS";
type Filter = "All" | "Completed" | "Pending" | "Need Revision";
type Priority = "Critical" | "High" | "Medium to High" | "Medium" | "Mandatory" | "Very High";

type Topic = {
  name: string;
  priority: Priority;
};

type Subject = {
  subject: string;
  unit: string;
  tier: string;
  priority: Priority;
  topics: string[];
};

type TopicState = {
  completed: boolean;
  needsRevision: boolean;
  remarks: string;
  updatedAt?: string;
};

const syllabus: Record<Exam, Subject[]> = {
  SSC: [
    {
      subject: "Quantitative Aptitude / Mathematical Abilities",
      unit: "Arithmetic Proficiency",
      tier: "Tier 1 & Tier 2",
      priority: "High",
      topics: [
        "Number systems",
        "Integers",
        "Fractions",
        "Decimals",
        "Surds",
        "LCM",
        "HCF",
        "Percentage dynamics",
        "Ratio and proportion",
        "Partnership fundamentals",
        "Averages",
        "Mixtures",
        "Alligation concepts",
        "Profit and loss",
        "Discounts",
        "Simple interest",
        "Compound interest",
        "Work-rate metrics",
        "Time-speed-distance",
        "Relative motion applications",
      ],
    },
    {
      subject: "Quantitative Aptitude / Mathematical Abilities",
      unit: "Advanced Mathematics",
      tier: "Tier 1 & Tier 2",
      priority: "High",
      topics: [
        "Algebraic identities",
        "Factorization matrices",
        "Linear graphs",
        "Elementary geometry",
        "Triangle centers",
        "Congruence of triangles",
        "Similarity of triangles",
        "Circle chords",
        "Circle tangents",
        "Mensuration",
        "Surface areas of 2D shapes",
        "Volumes of 2D shapes",
        "Surface areas of 3D shapes",
        "Volumes of 3D shapes",
        "Pyramids",
        "Prisms",
        "Spheres",
        "Trigonometry ratios",
        "Standard trigonometric identities",
        "Complementary angles",
        "Height and distance",
      ],
    },
    {
      subject: "English Language & Comprehension",
      unit: "Grammatical Mechanics",
      tier: "Tier 1 & Tier 2",
      priority: "Critical",
      topics: [
        "Error spotting",
        "Phrase replacement",
        "Sentence correction systems",
        "Active to passive voice-flips",
        "Passive to active voice-flips",
        "Direct to indirect speech structural narration",
        "Indirect to direct speech structural narration",
      ],
    },
    {
      subject: "English Language & Comprehension",
      unit: "Reading & Textual Logic",
      tier: "Tier 1 & Tier 2",
      priority: "Critical",
      topics: [
        "Reading comprehension passages",
        "Core theme inference",
        "Cloze test evaluation",
        "Contextual paragraph filling",
        "Sentence jumbles",
        "Para-jumbles structural rearrangement",
      ],
    },
    {
      subject: "General Intelligence & Reasoning",
      unit: "Verbal & Logical Reasoning",
      tier: "Tier 1 & Tier 2",
      priority: "High",
      topics: [
        "Analogies",
        "Classification codes",
        "Semantic coding-decoding",
        "Blood relations",
        "Direction mapping",
        "Sitting arrangements",
        "Ranking",
        "Syllogisms",
        "Statement-conclusion",
        "Course of action reasoning",
        "Critical thinking puzzles",
        "Data sufficiency",
      ],
    },
    {
      subject: "General Awareness",
      unit: "Static General Knowledge",
      tier: "Tier 1 & Tier 2",
      priority: "Medium",
      topics: [
        "Ancient Indian history",
        "Medieval Indian administration",
        "Modern Indian freedom struggle",
        "Physical geography of India",
        "Constitutional features of Indian Polity",
        "Core judiciary operations",
        "Everyday physics laws",
        "Chemical reactions",
        "Human biology",
        "Space programs",
        "National events",
        "Global events",
        "Economic developments",
        "Government flagship schemes",
      ],
    },
    {
      subject: "Computer Knowledge & Skills",
      unit: "Computer Proficiency",
      tier: "Tier 2 Only",
      priority: "Mandatory",
      topics: [
        "Hardware basics",
        "CPU architecture",
        "Input device frameworks",
        "Output device frameworks",
        "Operating systems",
        "Fundamental keyboard shortcuts",
        "MS Word processing documents",
        "MS Excel operations",
        "MS Powerpoint shortcuts",
        "Networking protocols",
        "Web browsing tools",
        "Cyber security safety",
      ],
    },
  ],
  RAS: [
    {
      subject: "History, Art, Culture, Literature, Tradition & Heritage",
      unit: "Rajasthan History, Art, and Culture",
      tier: "Tier 1 & Tier 2",
      priority: "Very High",
      topics: [
        "Palaeolithic sites",
        "Chalcolithic sites",
        "Ancient society of Rajasthan",
        "Major dynasties",
        "British treaties and relations",
        "1857 resistance in Rajasthan",
        "Peasant movements",
        "Tribal movements",
        "Unification of Rajasthan",
        "Saints and sects",
        "Folk deities of Rajasthan",
        "Temple architecture traditions",
        "Forts and palaces architecture",
        "Painting schools and developments",
        "Handicrafts of Rajasthan",
        "Folk dances",
        "Fairs and festivals",
        "Leading historical personalities of Rajasthan",
      ],
    },
    {
      subject: "History, Art, Culture, Literature, Tradition & Heritage",
      unit: "Indian History",
      tier: "Tier 1 & Tier 2",
      priority: "High",
      topics: [
        "Indus Valley Civilization",
        "Vedic age",
        "Buddhism",
        "Jainism",
        "Maurya dynasty achievements",
        "Gupta dynasty achievements",
        "Ancient Indian art and architecture",
        "Sultanate period dynasties",
        "Mughal administration and policies",
        "Marathas rise and consolidation",
        "Bhakti movement contribution",
        "Sufi movement contribution",
        "Revolt of 1857",
        "Emergence of modern nationalism",
        "Indian National Movement major events",
        "Post-independence consolidation",
      ],
    },
    {
      subject: "Geography",
      unit: "Geography of Rajasthan",
      tier: "Tier 1 & Tier 2",
      priority: "Very High",
      topics: [
        "Location and extent",
        "Physiographic divisions",
        "Rivers and drainage systems",
        "Lakes",
        "Climatic characteristics",
        "Natural vegetation",
        "Biodiversity and conservation",
        "Soil types and distribution",
        "Agriculture major crops",
        "Livestock and breeds",
        "Irrigation projects",
        "Population growth and density",
        "Tribes of Rajasthan",
        "Minerals",
        "Tourism infrastructure and circuits",
      ],
    },
    {
      subject: "Economy",
      unit: "Economy of Rajasthan",
      tier: "Tier 1 & Tier 2",
      priority: "Very High",
      topics: [
        "State macroeconomic overview",
        "Agricultural sector issues",
        "Industrial sector growth",
        "Service sector parameters",
        "Growth and planning strategies",
        "Infrastructure development",
        "Major state development projects",
        "Welfare schemes for SC and ST communities",
        "Welfare schemes for women and children",
        "Welfare schemes for farmers and laborers",
      ],
    },
    {
      subject: "Economy",
      unit: "Indian Economy & Global Concepts",
      tier: "Tier 1 & Tier 2",
      priority: "High",
      topics: [
        "National income measurement methods",
        "Economic growth concepts",
        "Human Development Index",
        "Inflation concept and control",
        "Banking operations and financial reforms",
        "RBI monetary management",
        "Fiscal Policy and reforms",
        "Union Budget framework",
        "Goods and Services Tax",
        "Public Distribution System",
        "Agriculture productivity",
        "Industrial policy and reforms",
        "MSME ecosystems",
        "Balance of Payments",
        "Poverty types and causes",
        "Unemployment types and solutions",
      ],
    },
    {
      subject: "Science, Technology, and Reasoning",
      unit: "Science & Technology",
      tier: "Tier 1 & Tier 2",
      priority: "High",
      topics: [
        "Everyday Physics principles",
        "Everyday Chemistry applications",
        "Human body systems",
        "Nutrition and health",
        "Information and Communication Technology",
        "Cyber security systems",
        "Artificial Intelligence implementations",
        "Space technology programs",
        "Defense technology developments",
        "Biotechnology applications",
        "Renewable energy options",
        "Environmental footprint metrics",
      ],
    },
    {
      subject: "Specialized Mains-Only Frameworks",
      unit: "Administrative Ethics",
      tier: "Tier 2 Only",
      priority: "High",
      topics: [
        "Ethics and human values",
        "Lessons from great leaders and administrators",
        "Role of family and educational institutions",
        "Concept of Duty",
        "Ethics in private and public relationships",
        "Integrity and impartiality",
        "Transparency in a liberal society",
        "Gandhian Ethics",
        "Ethical dilemmas in administration",
        "Ethical Case Studies",
      ],
    },
    {
      subject: "Language Papers",
      unit: "General Hindi & General English",
      tier: "Tier 2 Only",
      priority: "Critical",
      topics: [
        "Hindi Grammar",
        "Hindi unseen passage comprehension",
        "Hindi precis writing",
        "Hindi official letter drafting",
        "Hindi descriptive essay writing",
        "English Grammar Tenses",
        "English Prepositions",
        "English Voice-flips",
        "English Narration",
        "English Phrasal verbs and idioms",
        "English reading comprehension",
        "English formal letter writing",
      ],
    },
  ],
};

const filters: Filter[] = ["All", "Completed", "Pending", "Need Revision"];
const exams: Exam[] = ["SSC", "RAS"];

const priorityStyles: Record<Priority, { background: string; color: string }> = {
  Critical: { background: "#fce0e8", color: "#9f1239" },
  "Very High": { background: "#f8d7e2", color: "#9f1239" },
  High: { background: "#fce8ed", color: "#a04060" },
  "Medium to High": { background: "#fff1dc", color: "#9a5a24" },
  Medium: { background: "#f5e8f5", color: "#804080" },
  Mandatory: { background: "#efe5ff", color: "#6d3aa8" },
};

function makeTopicId(exam: Exam, subjectIndex: number, topic: string) {
  return `${exam}-${subjectIndex}-${topic.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

function formatUpdatedAt(value?: string) {
  if (!value) return "Not updated yet";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/80" style={{ border: "1px solid var(--border)" }}>
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{
          width: `${value}%`,
          background: "linear-gradient(135deg, #c9607a 0%, #e8a0b0 55%, #b87a5a 100%)",
          boxShadow: "0 4px 12px rgba(201, 96, 122, 0.28)",
        }}
      />
    </div>
  );
}

function TrackerContent() {
  const searchParams = useSearchParams();
  const user = searchParams.get("user") || "user1";
  const [exam, setExam] = useState<Exam>("SSC");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [openSubjects, setOpenSubjects] = useState<Record<string, boolean>>({ "SSC-0": true });
  const [topicStates, setTopicStates] = useState<Record<string, TopicState>>({});

  const allTopics = useMemo(
    () =>
      syllabus[exam].flatMap((subject, subjectIndex) =>
        subject.topics.map((topic) => ({
          ...subject,
          name: topic,
          id: makeTopicId(exam, subjectIndex, topic),
          subjectIndex,
        }))
      ),
    [exam]
  );

  const stats = useMemo(() => {
    const completed = allTopics.filter((topic) => topicStates[topic.id]?.completed).length;
    const revision = allTopics.filter((topic) => topicStates[topic.id]?.needsRevision).length;
    const subjectsCompleted = syllabus[exam].filter((subject, subjectIndex) =>
      subject.topics.every((topic) => topicStates[makeTopicId(exam, subjectIndex, topic)]?.completed)
    ).length;

    return {
      completed,
      remaining: allTopics.length - completed,
      progress: allTopics.length ? Math.round((completed / allTopics.length) * 100) : 0,
      subjectsCompleted,
      revision,
    };
  }, [allTopics, exam, topicStates]);

  const visibleSubjects = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return syllabus[exam]
      .map((subject, subjectIndex) => {
        const topics = subject.topics.filter((topic) => {
          const id = makeTopicId(exam, subjectIndex, topic);
          const state = topicStates[id];
          const matchesSearch =
            !needle ||
            subject.subject.toLowerCase().includes(needle) ||
            subject.unit.toLowerCase().includes(needle) ||
            topic.toLowerCase().includes(needle);
          const matchesFilter =
            filter === "All" ||
            (filter === "Completed" && state?.completed) ||
            (filter === "Pending" && !state?.completed) ||
            (filter === "Need Revision" && state?.needsRevision);

          return matchesSearch && matchesFilter;
        });

        return { ...subject, subjectIndex, topics };
      })
      .filter((subject) => subject.topics.length > 0);
  }, [exam, filter, query, topicStates]);

  const updateTopic = (id: string, patch: Partial<TopicState>) => {
    setTopicStates((current) => ({
      ...current,
      [id]: {
        ...(current[id] || { completed: false, needsRevision: false, remarks: "" }),
        ...patch,
        updatedAt: new Date().toISOString(),
      },
    }));
  };

  return (
    <div className="min-h-screen">
      <Navbar userName={user} />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <section
          className="relative mb-6 overflow-hidden rounded-2xl p-5 shadow-sm sm:p-7"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.84), rgba(252,232,237,0.88)), radial-gradient(circle at 12% 18%, rgba(201,96,122,0.18), transparent 28%), radial-gradient(circle at 88% 10%, rgba(184,122,90,0.16), transparent 24%)",
            border: "1.5px solid var(--border)",
            backdropFilter: "blur(18px)",
          }}
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted">Subject-wise confidence map</p>
              <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                🌸 Preparation Tracker
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-muted sm:text-base">
                Track your preparation subject-wise and build confidence.
              </p>
            </div>

            <div className="flex w-full rounded-full bg-white/80 p-1 shadow-sm sm:w-auto" style={{ border: "1.5px solid var(--border)" }}>
              {exams.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setExam(item);
                    setFilter("All");
                    setOpenSubjects({ [`${item}-0`]: true });
                  }}
                  className="flex-1 rounded-full px-7 py-2.5 font-display text-sm font-bold transition-all sm:flex-none"
                  style={{
                    background: exam === item ? "linear-gradient(135deg, #c9607a, #a04060)" : "transparent",
                    color: exam === item ? "white" : "var(--muted)",
                    boxShadow: exam === item ? "0 8px 22px rgba(201, 96, 122, 0.24)" : "none",
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Completed Topics", value: stats.completed, accent: "🌷" },
            { label: "Remaining Topics", value: stats.remaining, accent: "🪷" },
            { label: "Overall Progress", value: `${stats.progress}%`, accent: "✨" },
            { label: "Subjects Completed", value: `${stats.subjectsCompleted}/${syllabus[exam].length}`, accent: "🌿" },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-2xl bg-white/82 p-5 shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
              style={{ border: "1.5px solid var(--border)", backdropFilter: "blur(12px)" }}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-2xl">{card.accent}</span>
                <span className="rounded-full px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-wider text-muted" style={{ background: "var(--cream)" }}>
                  {exam}
                </span>
              </div>
              <div className="font-display text-2xl font-bold">{card.value}</div>
              <div className="mt-1 text-xs font-display uppercase tracking-widest text-muted">{card.label}</div>
            </div>
          ))}
        </section>

        <section
          className="mb-6 rounded-2xl bg-white/80 p-4 shadow-sm"
          style={{ border: "1.5px solid var(--border)", backdropFilter: "blur(14px)" }}
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <input
              className="field-input min-h-11 flex-1"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="🔍 Search subjects or topics..."
            />

            <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
              {filters.map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className="whitespace-nowrap rounded-full px-4 py-2 font-display text-xs font-bold uppercase tracking-wider transition-all"
                  style={{
                    background: filter === item ? "var(--ink)" : "var(--cream)",
                    border: "1.5px solid var(--border)",
                    color: filter === item ? "var(--paper)" : "var(--muted)",
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <ProgressBar value={stats.progress} />
            <span className="min-w-12 text-right font-mono text-sm font-semibold text-muted">{stats.progress}%</span>
          </div>
        </section>

        <section className="space-y-4">
          {visibleSubjects.length === 0 ? (
            <div
              className="rounded-2xl p-10 text-center"
              style={{ background: "var(--surface)", border: "1.5px dashed var(--border)" }}
            >
              <p className="font-display font-bold">No matching topics found.</p>
              <p className="mt-1 text-sm text-muted">Try a softer search or switch the filter.</p>
            </div>
          ) : (
            visibleSubjects.map((subject) => {
              const subjectKey = `${exam}-${subject.subjectIndex}`;
              const originalSubject = syllabus[exam][subject.subjectIndex];
              const completed = originalSubject.topics.filter(
                (topic) => topicStates[makeTopicId(exam, subject.subjectIndex, topic)]?.completed
              ).length;
              const progress = Math.round((completed / originalSubject.topics.length) * 100);
              const isOpen = openSubjects[subjectKey] ?? subject.subjectIndex === 0;

              return (
                <article
                  key={subjectKey}
                  className="overflow-hidden rounded-2xl bg-white/85 shadow-sm fade-in"
                  style={{ border: "1.5px solid var(--border)", backdropFilter: "blur(14px)" }}
                >
                  <button
                    onClick={() => setOpenSubjects((current) => ({ ...current, [subjectKey]: !isOpen }))}
                    className="w-full p-5 text-left transition-colors hover:bg-[#fff8fa]"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span
                            className="rounded-full px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-wider"
                            style={priorityStyles[subject.priority]}
                          >
                            {subject.priority}
                          </span>
                          <span className="rounded-full px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-wider text-muted" style={{ background: "var(--cream)" }}>
                            {subject.tier}
                          </span>
                        </div>
                        <h2 className="font-display text-lg font-bold leading-tight sm:text-xl">{subject.subject}</h2>
                        <p className="mt-1 text-sm text-muted">{subject.unit}</p>
                      </div>

                      <div className="w-full lg:max-w-xs">
                        <div className="mb-2 flex items-center justify-between text-xs font-display font-bold uppercase tracking-widest text-muted">
                          <span>{completed}/{originalSubject.topics.length} topics</span>
                          <span>{progress}% {isOpen ? "−" : "+"}</span>
                        </div>
                        <ProgressBar value={progress} />
                      </div>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="space-y-3 border-t p-4 sm:p-5" style={{ borderColor: "var(--border)" }}>
                      {subject.topics.map((topic) => {
                        const id = makeTopicId(exam, subject.subjectIndex, topic);
                        const state = topicStates[id] || { completed: false, needsRevision: false, remarks: "" };
                        const topicItem: Topic = { name: topic, priority: subject.priority };

                        return (
                          <div
                            key={id}
                            className="grid gap-3 rounded-xl p-4 transition-all lg:grid-cols-[minmax(0,1fr)_280px]"
                            style={{
                              background: state.completed ? "#fff0f4" : "#ffffff",
                              border: `1.5px solid ${state.completed ? "#e8a0b0" : "var(--border)"}`,
                              boxShadow: state.completed ? "0 8px 24px rgba(201, 96, 122, 0.09)" : "none",
                            }}
                          >
                            <div className="flex min-w-0 gap-3">
                              <input
                                type="checkbox"
                                checked={state.completed}
                                onChange={(event) => updateTopic(id, { completed: event.target.checked })}
                                className="mt-1 h-4 w-4 shrink-0 cursor-pointer"
                                style={{ accentColor: "var(--accent)" }}
                              />
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3
                                    className="font-display text-sm font-bold leading-snug"
                                    style={{ color: state.completed ? "var(--accent)" : "var(--ink)" }}
                                  >
                                    {topicItem.name}
                                  </h3>
                                  <span
                                    className="rounded-full px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider"
                                    style={priorityStyles[topicItem.priority]}
                                  >
                                    {topicItem.priority}
                                  </span>
                                  <button
                                    onClick={() => updateTopic(id, { needsRevision: !state.needsRevision })}
                                    className="rounded-full px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider transition-all"
                                    style={{
                                      background: state.needsRevision ? "#fff1dc" : "var(--cream)",
                                      border: "1px solid var(--border)",
                                      color: state.needsRevision ? "#9a5a24" : "var(--muted)",
                                    }}
                                  >
                                    Need Revision
                                  </button>
                                </div>
                                <p className="mt-2 font-mono text-[0.7rem] uppercase tracking-wider text-muted">
                                  Last Updated: {formatUpdatedAt(state.updatedAt)}
                                </p>
                              </div>
                            </div>

                            <textarea
                              value={state.remarks}
                              onChange={(event) => updateTopic(id, { remarks: event.target.value })}
                              placeholder="What should I improve?"
                              rows={3}
                              className="field-input min-h-20 resize-none text-sm"
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </article>
              );
            })
          )}
        </section>
      </main>
    </div>
  );
}

export default function TrackerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted">Loading...</div>}>
      <TrackerContent />
    </Suspense>
  );
}
