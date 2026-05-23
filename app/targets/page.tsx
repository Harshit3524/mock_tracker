"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import { format } from "date-fns";

type Target = {
  id: string;
  user_name: string;
  date: string;
  type: "topic" | "chapter";
  content: string;
  done: boolean;
  created_at: string;
};

function TargetsContent() {
  const searchParams = useSearchParams();
  const user = searchParams.get("user") || "user1";
  const otherUser = user === "user1" ? "user2" : "user1";
  const today = format(new Date(), "yyyy-MM-dd");

  const [myTargets, setMyTargets] = useState<Target[]>([]);
  const [theirTargets, setTheirTargets] = useState<Target[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [type, setType] = useState<"topic" | "chapter">("topic");
  const [adding, setAdding] = useState(false);

  const getDisplayName = (u: string) => u === "user1" ? "Harshit" : "Khushi ✨";

  const fetchTargets = async () => {
    setLoading(true);
    const { data: mine } = await supabase
      .from("daily_targets")
      .select("*")
      .eq("user_name", user)
      .eq("date", today)
      .order("created_at", { ascending: true });

    const { data: theirs } = await supabase
      .from("daily_targets")
      .select("*")
      .eq("user_name", otherUser)
      .eq("date", today)
      .order("created_at", { ascending: true });

    setMyTargets(mine || []);
    setTheirTargets(theirs || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTargets();

    const channel = supabase
      .channel("targets")
      .on("postgres_changes", { event: "*", schema: "public", table: "daily_targets" }, fetchTargets)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const addTarget = async () => {
    if (!content.trim()) return;
    setAdding(true);
    await supabase.from("daily_targets").insert({
      user_name: user,
      date: today,
      type,
      content: content.trim(),
      done: false,
    });
    setContent("");
    setAdding(false);
  };

  const toggleDone = async (target: Target) => {
    await supabase
      .from("daily_targets")
      .update({ done: !target.done })
      .eq("id", target.id);
    fetchTargets();
  };

  const deleteTarget = async (id: string) => {
    await supabase.from("daily_targets").delete().eq("id", id);
    fetchTargets();
  };

  const myDone = myTargets.filter((t) => t.done).length;
  const theirDone = theirTargets.filter((t) => t.done).length;

  const TargetList = ({
    targets,
    isMe,
    userName,
  }: {
    targets: Target[];
    isMe: boolean;
    userName: string;
  }) => (
    <div
      className="rounded-xl p-5 flex-1"
      style={{ background: "var(--surface)", border: "1.5px solid var(--border)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display font-bold text-base">
            {isMe ? "Your Targets" : `${getDisplayName(userName)}'s Targets`}
          </h2>
          <p className="text-muted text-xs mt-0.5">
            {isMe ? myDone : theirDone}/{targets.length} done
          </p>
        </div>
        {targets.length > 0 && (
          <div
            className="text-xs font-mono px-3 py-1 rounded-full"
            style={{
              background:
                (isMe ? myDone : theirDone) === targets.length && targets.length > 0
                  ? "#d4f0d4"
                  : "var(--border)",
              color:
                (isMe ? myDone : theirDone) === targets.length && targets.length > 0
                  ? "#1a6b1a"
                  : "var(--muted)",
            }}
          >
            {Math.round(((isMe ? myDone : theirDone) / targets.length) * 100)}%
          </div>
        )}
      </div>

      {targets.length === 0 ? (
        <p className="text-muted text-sm text-center py-8">No targets set for today.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {targets.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-3 p-3 rounded-lg"
              style={{
                background: t.done ? "#f0fdf0" : "white",
                border: `1.5px solid ${t.done ? "#86efac" : "var(--border)"}`,
                opacity: t.done ? 0.75 : 1,
                transition: "all 0.2s",
              }}
            >
              {isMe && (
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() => toggleDone(t)}
                  style={{ width: 16, height: 16, cursor: "pointer", accentColor: "var(--ink)" }}
                />
              )}
              {!isMe && (
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: t.done ? "#22c55e" : "var(--border)",
                    flexShrink: 0,
                  }}
                />
              )}
              <div className="flex-1 min-w-0">
                <span
                  className="text-sm"
                  style={{
                    textDecoration: t.done ? "line-through" : "none",
                    color: t.done ? "var(--muted)" : "var(--ink)",
                  }}
                >
                  {t.content}
                </span>
                <span
                  className="ml-2 text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: t.type === "topic" ? "#dbeafe" : "#fef9c3",
                    color: t.type === "topic" ? "#1e40af" : "#854d0e",
                  }}
                >
                  {t.type}
                </span>
              </div>
              {isMe && (
                <button
                  onClick={() => deleteTarget(t.id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--muted)",
                    fontSize: "1rem",
                    padding: "0 4px",
                  }}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen">
      <Navbar userName={user} />
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <p className="text-muted text-sm font-mono uppercase tracking-widest">
            {format(new Date(), "EEEE, dd MMMM yyyy")}
          </p>
          <h1 className="font-display font-bold text-3xl mt-0.5">
            Daily Targets<span style={{ color: "var(--accent)" }}>.</span>
          </h1>
        </div>

        {/* Add Target Form */}
        <div
          className="rounded-xl p-5 mb-8"
          style={{ background: "var(--surface)", border: "1.5px solid var(--border)" }}
        >
          <h3 className="font-display font-bold text-sm uppercase tracking-widest mb-4 text-muted">
            Add Today's Target
          </h3>
          <div className="flex gap-3 flex-wrap">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "topic" | "chapter")}
              className="field-input"
              style={{ width: "auto", minWidth: 130 }}
            >
              <option value="topic">📚 Topic</option>
              <option value="chapter">📖 Chapter</option>
            </select>
            <input
              className="field-input flex-1"
              style={{ minWidth: 200 }}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                type === "topic"
                  ? "e.g. Thermodynamics Laws"
                  : "e.g. Organic Chemistry Ch. 12"
              }
              onKeyDown={(e) => e.key === "Enter" && addTarget()}
            />
            <button className="btn-primary" onClick={addTarget} disabled={adding}>
              {adding ? "Adding..." : "+ Add"}
            </button>
          </div>
        </div>

        {/* Two column target lists */}
        {loading ? (
          <p className="text-muted text-sm">Loading targets...</p>
        ) : (
          <div className="flex gap-6 flex-col md:flex-row">
            <TargetList targets={myTargets} isMe={true} userName={user} />
            <TargetList targets={theirTargets} isMe={false} userName={otherUser} />
          </div>
        )}
      </main>
    </div>
  );
}

export default function TargetsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted">Loading...</div>}>
      <TargetsContent />
    </Suspense>
  );
}