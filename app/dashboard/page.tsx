"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import AddMockForm from "@/components/AddMockForm";
import Charts from "@/components/Charts";
import PdfSection from "@/components/PdfSection";
import { MockEntry } from "@/lib/supabase";
import { format, parseISO } from "date-fns";

function getScoreClass(score: number, max: number) {
  const pct = (score / max) * 100;
  if (pct >= 75) return "score-badge score-high";
  if (pct >= 50) return "score-badge score-mid";
  return "score-badge score-low";
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const user = searchParams.get("user") || "user1";
  const displayName = user === "user1" ? "User 1" : "User 2";

  const [entries, setEntries] = useState<MockEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"table" | "charts" | "docs">("table");

  const fetchEntries = async () => {
    setLoading(true);
    const res = await fetch(`/api/mocks?user=${user}`);
    const data = await res.json();
    setEntries(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
  }, [user]);

  const deleteEntry = async (id: string) => {
    if (!confirm("Delete this entry?")) return;
    await fetch(`/api/mocks/${id}`, { method: "DELETE" });
    fetchEntries();
  };

  const avgScore = entries.length
    ? Math.round(entries.reduce((s, e) => s + (e.score / e.max_score) * 100, 0) / entries.length)
    : 0;
  const avgAccuracy = entries.length
    ? Math.round((entries.reduce((s, e) => s + e.accuracy, 0) / entries.length) * 10) / 10
    : 0;
  const best = entries.length
    ? entries.reduce((b, e) => ((e.score / e.max_score) > (b.score / b.max_score) ? e : b))
    : null;

  return (
    <div className="min-h-screen">
      <Navbar userName={user} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-muted text-sm font-mono uppercase tracking-widest">Dashboard</p>
            <h1 className="font-display font-bold text-3xl mt-0.5">
              {displayName}
              <span style={{ color: "var(--accent)" }}>.</span>
            </h1>
          </div>
          <div
            className="text-right text-sm"
            style={{ color: "var(--muted)", fontFamily: "'JetBrains Mono', monospace" }}
          >
            {entries.length} mock{entries.length !== 1 ? "s" : ""} logged
          </div>
        </div>

        {/* Stats Cards */}
        {entries.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "Avg Score %", value: `${avgScore}%`, icon: "📊" },
              { label: "Avg Accuracy", value: `${avgAccuracy}%`, icon: "🎯" },
              {
                label: "Best Mock",
                value: best ? best.exam_name.slice(0, 20) : "—",
                icon: "🏆",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl p-5"
                style={{ background: "var(--surface)", border: "1.5px solid var(--border)" }}
              >
                <div className="text-xl mb-2">{stat.icon}</div>
                <div className="font-display font-bold text-lg leading-tight">{stat.value}</div>
                <div className="text-muted text-xs mt-1 font-display uppercase tracking-widest">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6" style={{ borderBottom: "1.5px solid var(--border)" }}>
          {(["table", "charts", "docs"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "8px 18px",
                background: tab === t ? "var(--ink)" : "transparent",
                color: tab === t ? "var(--paper)" : "var(--muted)",
                border: "none",
                borderRadius: "6px 6px 0 0",
                fontFamily: "'Syne', sans-serif",
                fontWeight: 600,
                fontSize: "0.78rem",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                cursor: "pointer",
                transition: "all 0.15s",
                marginBottom: "-1.5px",
              }}
            >
              {t === "table" ? "📋 Scores" : t === "charts" ? "📈 Charts" : "📁 Docs"}
            </button>
          ))}
        </div>

        {/* Table Tab */}
        {tab === "table" && (
          <div className="fade-in">
            <AddMockForm userName={user} onAdded={fetchEntries} />

            {loading ? (
              <p className="text-muted text-sm mt-6">Loading entries...</p>
            ) : entries.length === 0 ? (
              <div
                className="text-center py-16 rounded-xl mt-4"
                style={{ background: "var(--surface)", border: "1.5px dashed var(--border)" }}
              >
                <div className="text-4xl mb-3">📝</div>
                <p className="font-display font-semibold">No entries yet</p>
                <p className="text-muted text-sm mt-1">Add your first mock exam above!</p>
              </div>
            ) : (
              <div
                className="rounded-xl overflow-hidden mt-2"
                style={{ border: "1.5px solid var(--border)" }}
              >
                <div className="overflow-x-auto">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Exam</th>
                        <th>Date</th>
                        <th>Platform</th>
                        <th>Score</th>
                        <th>Score %</th>
                        <th>Accuracy</th>
                        <th>Notes</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {entries.map((e) => (
                        <tr key={e.id}>
                          <td className="font-semibold" style={{ maxWidth: 180 }}>
                            {e.exam_name}
                          </td>
                          <td style={{ whiteSpace: "nowrap", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem" }}>
                            {format(parseISO(e.exam_date), "dd MMM yy")}
                          </td>
                          <td style={{ color: "var(--muted)" }}>{e.platform || "—"}</td>
                          <td>
                            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.88rem" }}>
                              {e.score}/{e.max_score}
                            </span>
                          </td>
                          <td>
                            <span className={getScoreClass(e.score, e.max_score)}>
                              {Math.round((e.score / e.max_score) * 100)}%
                            </span>
                          </td>
                          <td>
                            <span className={getScoreClass(e.accuracy, 100)}>
                              {e.accuracy}%
                            </span>
                          </td>
                          <td style={{ color: "var(--muted)", fontSize: "0.82rem", maxWidth: 160 }}>
                            {e.notes || "—"}
                          </td>
                          <td>
                            <button className="btn-danger" onClick={() => deleteEntry(e.id)}>
                              Del
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Charts Tab */}
        {tab === "charts" && (
          <div className="fade-in">
            {entries.length < 2 ? (
              <div
                className="text-center py-16 rounded-xl"
                style={{ background: "var(--surface)", border: "1.5px dashed var(--border)" }}
              >
                <div className="text-4xl mb-3">📈</div>
                <p className="font-display font-semibold">Need at least 2 entries for charts</p>
                <p className="text-muted text-sm mt-1">
                  Add more mock entries to see your progress visualised.
                </p>
              </div>
            ) : (
              <Charts entries={entries} />
            )}
          </div>
        )}

        {/* Docs Tab */}
        {tab === "docs" && (
          <div className="fade-in">
            <PdfSection userName={user} />
          </div>
        )}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
