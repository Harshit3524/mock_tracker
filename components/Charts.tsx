"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { MockEntry } from "@/lib/supabase";
import { format, parseISO } from "date-fns";

interface ChartsProps {
  entries: MockEntry[];
}

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
          <p key={p.name}>
            {p.name}: <strong>{p.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Charts({ entries }: ChartsProps) {
  const sorted = [...entries].sort(
    (a, b) => new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime()
  );

  const chartData = sorted.map((e) => ({
    date: format(parseISO(e.exam_date), "dd MMM"),
    Score: e.score,
    Accuracy: e.accuracy,
    "Score %": Math.round((e.score / e.max_score) * 100),
    name: e.exam_name,
  }));

  if (entries.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-8">
      {/* Score Trend */}
      <div
        className="rounded-xl p-5"
        style={{ background: "var(--surface)", border: "1.5px solid var(--border)" }}
      >
        <h3 className="font-display font-bold text-sm uppercase tracking-widest mb-4 text-muted">
          Score Trend
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fontFamily: "DM Sans" }}
              stroke="var(--border)"
            />
            <YAxis tick={{ fontSize: 11, fontFamily: "DM Sans" }} stroke="var(--border)" />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="Score"
              stroke="#e84a2e"
              strokeWidth={2.5}
              dot={{ fill: "#e84a2e", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Accuracy Trend */}
      <div
        className="rounded-xl p-5"
        style={{ background: "var(--surface)", border: "1.5px solid var(--border)" }}
      >
        <h3 className="font-display font-bold text-sm uppercase tracking-widest mb-4 text-muted">
          Accuracy Trend (%)
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fontFamily: "DM Sans" }}
              stroke="var(--border)"
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fontFamily: "DM Sans" }}
              stroke="var(--border)"
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="Accuracy"
              stroke="#c9a84c"
              strokeWidth={2.5}
              dot={{ fill: "#c9a84c", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Score % Bar Chart */}
      <div
        className="rounded-xl p-5 md:col-span-2"
        style={{ background: "var(--surface)", border: "1.5px solid var(--border)" }}
      >
        <h3 className="font-display font-bold text-sm uppercase tracking-widest mb-4 text-muted">
          Score % Per Mock
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fontFamily: "DM Sans" }}
              stroke="var(--border)"
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fontFamily: "DM Sans" }}
              stroke="var(--border)"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="Score %" fill="#0f0e0d" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
