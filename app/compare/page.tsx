"use client";
import { useState, useEffect, Suspense } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import Navbar from "@/components/Navbar";
import { MockEntry } from "@/lib/supabase";
import { format, parseISO } from "date-fns";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "var(--ink)",
          color: "var(--paper)",
          padding: "10px 14px",
          borderRadius: "8px",
          fontSize: "0.8rem",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, marginBottom: 4 }}>
          {label}
        </p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: <strong>{p.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function CompareContent() {
  const [u1, setU1] = useState<MockEntry[]>([]);
  const [u2, setU2] = useState<MockEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/mocks?user=user1").then((r) => r.json()),
      fetch("/api/mocks?user=user2").then((r) => r.json()),
    ]).then(([d1, d2]) => {
      setU1(d1 || []);
      setU2(d2 || []);
      setLoading(false);
    });
  }, []);

  const avg = (arr: MockEntry[], key: "score_pct" | "accuracy") => {
    if (!arr.length) return 0;
    if (key === "score_pct")
      return Math.round(arr.reduce((s, e) => s + (e.score / e.max_score) * 100, 0) / arr.length);
    return Math.round((arr.reduce((s, e) => s + e.accuracy, 0) / arr.length) * 10) / 10;
  };

  // Build a combined timeline (by exam date)
  const allDates = Array.from(
    new Set([
      ...u1.map((e) => e.exam_date),
      ...u2.map((e) => e.exam_date),
    ])
  ).sort();

  const timelineData = allDates.map((date) => {
    const e1 = u1.filter((e) => e.exam_date === date);
    const e2 = u2.filter((e) => e.exam_date === date);
    return {
      date: format(parseISO(date), "dd MMM"),
      "User 1": e1.length
        ? Math.round((e1[0].score / e1[0].max_score) * 100)
        : null,
      "User 2": e2.length
        ? Math.round((e2[0].score / e2[0].max_score) * 100)
        : null,
      "User 1 Acc": e1.length ? e1[0].accuracy : null,
      "User 2 Acc": e2.length ? e2[0].accuracy : null,
    };
  });

  const stats = [
    {
      label: "Avg Score %",
      u1: `${avg(u1, "score_pct")}%`,
      u2: `${avg(u2, "score_pct")}%`,
    },
    {
      label: "Avg Accuracy",
      u1: `${avg(u1, "accuracy")}%`,
      u2: `${avg(u2, "accuracy")}%`,
    },
    { label: "Mocks Attempted", u1: u1.length, u2: u2.length },
    {
      label: "Best Score %",
      u1: u1.length
        ? `${Math.max(...u1.map((e) => Math.round((e.score / e.max_score) * 100)))}%`
        : "—",
      u2: u2.length
        ? `${Math.max(...u2.map((e) => Math.round((e.score / e.max_score) * 100)))}%`
        : "—",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <p className="text-muted text-sm font-mono uppercase tracking-widest">Side by Side</p>
          <h1 className="font-display font-bold text-3xl mt-0.5">
            Comparison<span style={{ color: "var(--accent)" }}>.</span>
          </h1>
        </div>

        {loading ? (
          <p className="text-muted text-sm">Loading data...</p>
        ) : (
          <>
            {/* Stats comparison table */}
            <div
              className="rounded-xl overflow-hidden mb-8"
              style={{ border: "1.5px solid var(--border)" }}
            >
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th style={{ color: "#e84a2e" }}>👤 User 1</th>
                    <th style={{ color: "#c9a84c" }}>👤 User 2</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map((s) => (
                    <tr key={s.label}>
                      <td className="font-semibold">{s.label}</td>
                      <td style={{ fontFamily: "'JetBrains Mono', monospace", color: "#e84a2e" }}>
                        {s.u1}
                      </td>
                      <td style={{ fontFamily: "'JetBrains Mono', monospace", color: "#c9a84c" }}>
                        {s.u2}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Charts */}
            {timelineData.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                <div
                  className="rounded-xl p-5"
                  style={{ background: "var(--surface)", border: "1.5px solid var(--border)" }}
                >
                  <h3 className="font-display font-bold text-sm uppercase tracking-widest mb-4 text-muted">
                    Score % — Head to Head
                  </h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={timelineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fontFamily: "DM Sans" }} stroke="var(--border)" />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11, fontFamily: "DM Sans" }} stroke="var(--border)" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line type="monotone" dataKey="User 1" stroke="#e84a2e" strokeWidth={2.5} dot={{ r: 4 }} connectNulls />
                      <Line type="monotone" dataKey="User 2" stroke="#c9a84c" strokeWidth={2.5} dot={{ r: 4 }} connectNulls />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div
                  className="rounded-xl p-5"
                  style={{ background: "var(--surface)", border: "1.5px solid var(--border)" }}
                >
                  <h3 className="font-display font-bold text-sm uppercase tracking-widest mb-4 text-muted">
                    Accuracy % — Head to Head
                  </h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={timelineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fontFamily: "DM Sans" }} stroke="var(--border)" />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11, fontFamily: "DM Sans" }} stroke="var(--border)" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line type="monotone" dataKey="User 1 Acc" name="User 1 Acc" stroke="#e84a2e" strokeWidth={2.5} strokeDasharray="5 5" dot={{ r: 4 }} connectNulls />
                      <Line type="monotone" dataKey="User 2 Acc" name="User 2 Acc" stroke="#c9a84c" strokeWidth={2.5} strokeDasharray="5 5" dot={{ r: 4 }} connectNulls />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div
                className="text-center py-16 rounded-xl"
                style={{ background: "var(--surface)", border: "1.5px dashed var(--border)" }}
              >
                <div className="text-4xl mb-3">📊</div>
                <p className="font-display font-semibold">No data to compare yet</p>
                <p className="text-muted text-sm mt-1">
                  Both users need to log some mocks first.
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted">Loading...</div>}>
      <CompareContent />
    </Suspense>
  );
}