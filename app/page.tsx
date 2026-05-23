import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      {/* Background texture */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230f0e0d' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="text-center max-w-2xl fade-in">
        <div className="inline-block bg-ink text-paper px-3 py-1 text-xs font-mono tracking-widest uppercase mb-8 rounded">
          Private • Just Us Two
        </div>

        <h1 className="font-display text-6xl md:text-7xl font-bold text-ink leading-none mb-4">
          Mock
          <span className="text-accent">.</span>
          <br />
          Tracker
        </h1>

        <p className="text-muted text-lg mb-12 font-light leading-relaxed">
          Log your mock exams, track accuracy & scores,
          <br />
          visualise your progress, and share study material.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard?user=user1"
            className="btn-primary text-center py-4 px-10 text-sm rounded-lg"
            style={{ textDecoration: "none" }}
          >
            👤 Harshit
          </Link>
          <Link
            href="/dashboard?user=user2"
            className="btn-primary text-center py-4 px-10 text-sm rounded-lg"
            style={{
              textDecoration: "none",
              background: "var(--gold)",
              color: "var(--ink)",
            }}
          >
            👤 Khushi ✨
          </Link>
        </div>

        <div className="mt-6">
          <Link
            href="/compare"
            className="text-muted text-sm underline underline-offset-4 hover:text-ink transition-colors"
          >
            📊 View Comparison →
          </Link>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-3 gap-6 text-left border-t border-border pt-10">
          {[
            { icon: "📋", label: "Score Logs", desc: "Excel-like table for every mock" },
            { icon: "📈", label: "Progress Charts", desc: "Visualise trends over time" },
            { icon: "📁", label: "Study Docs", desc: "Upload & share PDFs privately" },
          ].map((f) => (
            <div key={f.label}>
              <div className="text-2xl mb-2">{f.icon}</div>
              <div className="font-display font-semibold text-sm">{f.label}</div>
              <div className="text-muted text-xs mt-1">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
