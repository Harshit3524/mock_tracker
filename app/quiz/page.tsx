"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import { format } from "date-fns";

type QuizFile = {
  id: string;
  name: string;
  description: string;
  uploaded_by: string;
  file_path: string;
  created_at: string;
};

function QuizContent() {
  const searchParams = useSearchParams();
  const user = searchParams.get("user") || "user1";
  const getDisplayName = (u: string) => u === "user1" ? "Harshit" : "Khushi ✨";

  const [quizzes, setQuizzes] = useState<QuizFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<QuizFile | null>(null);

  const fetchQuizzes = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("quiz_files")
      .select("*")
      .order("created_at", { ascending: false });
    setQuizzes(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const uploadQuiz = async () => {
    if (!file || !name.trim()) {
      alert("Please provide a name and select an HTML file.");
      return;
    }
    if (!file.name.endsWith(".html")) {
      alert("Only HTML files are supported.");
      return;
    }

    setUploading(true);
    const fileName = `${Date.now()}_${file.name.replace(/\s/g, "_")}`;

    const { error } = await supabase.storage
      .from("quizzes")
      .upload(fileName, file, { contentType: "text/html" });

    if (error) {
      alert("Upload failed: " + error.message);
      setUploading(false);
      return;
    }

    await supabase.from("quiz_files").insert({
      name: name.trim(),
      description: description.trim(),
      uploaded_by: user,
      file_path: fileName,
    });

    setName("");
    setDescription("");
    setFile(null);
    setShowForm(false);
    setUploading(false);
    fetchQuizzes();
  };

  const deleteQuiz = async (quiz: QuizFile) => {
    if (!confirm(`Delete "${quiz.name}"?`)) return;
    await supabase.storage.from("quizzes").remove([quiz.file_path]);
    await supabase.from("quiz_files").delete().eq("id", quiz.id);
    if (activeQuiz?.id === quiz.id) setActiveQuiz(null);
    fetchQuizzes();
  };

  const getPublicUrl = (filePath: string) => {
    const { data } = supabase.storage.from("quizzes").getPublicUrl(filePath);
    return data.publicUrl;
  };

  return (
    <div className="min-h-screen">
      <Navbar userName={user} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-muted text-sm font-mono uppercase tracking-widest">Practice</p>
            <h1 className="font-display font-bold text-3xl mt-0.5">
              Quiz Library<span style={{ color: "var(--accent)" }}>.</span>
            </h1>
          </div>
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "+ Upload Quiz"}
          </button>
        </div>

        {/* Upload Form */}
        {showForm && (
          <div
            className="fade-in rounded-xl p-5 mb-8"
            style={{ background: "var(--surface)", border: "1.5px solid var(--border)" }}
          >
            <h3 className="font-display font-bold text-sm uppercase tracking-widest mb-4 text-muted">
              Upload HTML Quiz
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-display font-semibold uppercase tracking-widest mb-1 text-muted">
                  Quiz Name *
                </label>
                <input
                  className="field-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Physics Chapter 5 Quiz"
                />
              </div>
              <div>
                <label className="block text-xs font-display font-semibold uppercase tracking-widest mb-1 text-muted">
                  Description
                </label>
                <input
                  className="field-input"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional — topic, difficulty, etc."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-display font-semibold uppercase tracking-widest mb-1 text-muted">
                  HTML File *
                </label>
                <input
                  type="file"
                  accept=".html"
                  className="field-input"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>
            <button className="btn-primary mt-4" onClick={uploadQuiz} disabled={uploading}>
              {uploading ? "Uploading..." : "Upload Quiz"}
            </button>
          </div>
        )}

        {/* Main layout — quiz list + iframe */}
        <div className="flex gap-6" style={{ minHeight: 600 }}>
          {/* Quiz list */}
          <div style={{ width: activeQuiz ? 280 : "100%", flexShrink: 0, transition: "width 0.3s" }}>
            {loading ? (
              <p className="text-muted text-sm">Loading quizzes...</p>
            ) : quizzes.length === 0 ? (
              <div
                className="text-center py-20 rounded-xl"
                style={{ background: "var(--surface)", border: "1.5px dashed var(--border)" }}
              >
                <div className="text-4xl mb-3">🧠</div>
                <p className="font-display font-semibold">No quizzes yet</p>
                <p className="text-muted text-sm mt-1">Upload an HTML quiz to get started!</p>
              </div>
            ) : (
              <div className={`grid gap-4 ${activeQuiz ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}>
                {quizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="fade-in rounded-xl p-4 cursor-pointer"
                    style={{
                      background: activeQuiz?.id === quiz.id ? "white" : "var(--surface)",
                      border: `1.5px solid ${activeQuiz?.id === quiz.id ? "var(--accent)" : "var(--border)"}`,
                      boxShadow: activeQuiz?.id === quiz.id ? "0 0 0 3px rgba(201,96,122,0.15)" : "none",
                      transition: "all 0.2s",
                    }}
                    onClick={() => setActiveQuiz(activeQuiz?.id === quiz.id ? null : quiz)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-2xl">🧠</div>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteQuiz(quiz); }}
                        className="btn-danger"
                        style={{ fontSize: "0.68rem", padding: "3px 8px" }}
                      >
                        Del
                      </button>
                    </div>
                    <div className="font-display font-bold text-sm mt-2">{quiz.name}</div>
                    {quiz.description && (
                      <div className="text-muted text-xs mt-1">{quiz.description}</div>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-muted">
                        by {getDisplayName(quiz.uploaded_by)}
                      </span>
                      <span className="text-xs font-mono text-muted">
                        {format(new Date(quiz.created_at), "dd MMM")}
                      </span>
                    </div>
                    <div
                      className="mt-3 text-center text-xs font-display font-semibold py-1.5 rounded-lg"
                      style={{
                        background: activeQuiz?.id === quiz.id
                          ? "linear-gradient(135deg, #c9607a, #a04060)"
                          : "var(--border)",
                        color: activeQuiz?.id === quiz.id ? "white" : "var(--muted)",
                      }}
                    >
                      {activeQuiz?.id === quiz.id ? "▶ Playing" : "▶ Start Quiz"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* iframe viewer */}
          {activeQuiz && (
            <div className="fade-in flex-1 flex flex-col" style={{ minWidth: 0 }}>
              <div
                className="flex items-center justify-between px-4 py-3 rounded-t-xl"
                style={{
                  background: "linear-gradient(135deg, #2d1b2e, #4a2340)",
                  border: "1.5px solid var(--border)",
                  borderBottom: "none",
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">🧠</span>
                  <div>
                    <div className="font-display font-bold text-sm" style={{ color: "white" }}>
                      {activeQuiz.name}
                    </div>
                    {activeQuiz.description && (
                      <div className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
                        {activeQuiz.description}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={getPublicUrl(activeQuiz.file_path)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: "rgba(255,255,255,0.15)",
                      color: "white",
                      border: "none",
                      padding: "5px 12px",
                      borderRadius: 6,
                      fontSize: "0.75rem",
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 600,
                      cursor: "pointer",
                      textDecoration: "none",
                    }}
                  >
                    ↗ Full Screen
                  </a>
                  <button
                    onClick={() => setActiveQuiz(null)}
                    style={{
                      background: "rgba(255,255,255,0.15)",
                      color: "white",
                      border: "none",
                      padding: "5px 12px",
                      borderRadius: 6,
                      fontSize: "0.75rem",
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    ✕ Close
                  </button>
                </div>
              </div>
              <iframe
                src={getPublicUrl(activeQuiz.file_path)}
                style={{
                  flex: 1,
                  width: "100%",
                  minHeight: 560,
                  border: "1.5px solid var(--border)",
                  borderTop: "none",
                  borderRadius: "0 0 12px 12px",
                  background: "white",
                }}
                title={activeQuiz.name}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted">Loading...</div>}>
      <QuizContent />
    </Suspense>
  );
}