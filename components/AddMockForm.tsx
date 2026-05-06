"use client";
import { useState } from "react";

interface AddMockFormProps {
  userName: string;
  onAdded: () => void;
}

export default function AddMockForm({ userName, onAdded }: AddMockFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    exam_name: "",
    exam_date: new Date().toISOString().split("T")[0],
    score: "",
    max_score: "100",
    accuracy: "",
    platform: "",
    notes: "",
  });

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const submit = async () => {
    if (!form.exam_name || !form.score || !form.accuracy) {
      alert("Please fill in exam name, score, and accuracy.");
      return;
    }
    setLoading(true);
    await fetch("/api/mocks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        user_name: userName,
        score: parseFloat(form.score),
        max_score: parseFloat(form.max_score),
        accuracy: parseFloat(form.accuracy),
      }),
    });
    setLoading(false);
    setOpen(false);
    setForm({
      exam_name: "",
      exam_date: new Date().toISOString().split("T")[0],
      score: "",
      max_score: "100",
      accuracy: "",
      platform: "",
      notes: "",
    });
    onAdded();
  };

  if (!open) {
    return (
      <button className="btn-primary" onClick={() => setOpen(true)}>
        + Add Mock Entry
      </button>
    );
  }

  return (
    <div
      className="fade-in rounded-xl p-6 mb-6"
      style={{ background: "var(--surface)", border: "1.5px solid var(--border)" }}
    >
      <h3 className="font-display font-bold text-base mb-5">New Mock Entry</h3>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <div className="col-span-2 md:col-span-1">
          <label className="block text-xs font-display font-semibold uppercase tracking-widest mb-1 text-muted">
            Exam Name *
          </label>
          <input
            className="field-input"
            name="exam_name"
            value={form.exam_name}
            onChange={handle}
            placeholder="e.g. JEE Mock #12"
          />
        </div>

        <div>
          <label className="block text-xs font-display font-semibold uppercase tracking-widest mb-1 text-muted">
            Date *
          </label>
          <input
            className="field-input"
            name="exam_date"
            type="date"
            value={form.exam_date}
            onChange={handle}
          />
        </div>

        <div>
          <label className="block text-xs font-display font-semibold uppercase tracking-widest mb-1 text-muted">
            Platform / Source
          </label>
          <input
            className="field-input"
            name="platform"
            value={form.platform}
            onChange={handle}
            placeholder="e.g. Allen, Aakash"
          />
        </div>

        <div>
          <label className="block text-xs font-display font-semibold uppercase tracking-widest mb-1 text-muted">
            Score *
          </label>
          <input
            className="field-input"
            name="score"
            type="number"
            value={form.score}
            onChange={handle}
            placeholder="e.g. 220"
          />
        </div>

        <div>
          <label className="block text-xs font-display font-semibold uppercase tracking-widest mb-1 text-muted">
            Max Score
          </label>
          <input
            className="field-input"
            name="max_score"
            type="number"
            value={form.max_score}
            onChange={handle}
            placeholder="e.g. 300"
          />
        </div>

        <div>
          <label className="block text-xs font-display font-semibold uppercase tracking-widest mb-1 text-muted">
            Accuracy % *
          </label>
          <input
            className="field-input"
            name="accuracy"
            type="number"
            value={form.accuracy}
            onChange={handle}
            placeholder="e.g. 78.5"
            min="0"
            max="100"
            step="0.1"
          />
        </div>

        <div className="col-span-2 md:col-span-3">
          <label className="block text-xs font-display font-semibold uppercase tracking-widest mb-1 text-muted">
            Notes
          </label>
          <input
            className="field-input"
            name="notes"
            value={form.notes}
            onChange={handle}
            placeholder="Optional remarks..."
          />
        </div>
      </div>

      <div className="flex gap-3 mt-5">
        <button className="btn-primary" onClick={submit} disabled={loading}>
          {loading ? "Saving..." : "Save Entry"}
        </button>
        <button
          onClick={() => setOpen(false)}
          style={{
            background: "transparent",
            border: "1.5px solid var(--border)",
            padding: "9px 20px",
            borderRadius: "6px",
            fontSize: "0.8rem",
            cursor: "pointer",
            fontFamily: "'Syne', sans-serif",
            fontWeight: 600,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
