import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Decorative blobs */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: "-10%",
          left: "-10%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,96,122,0.12) 0%, transparent 70%)",
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          bottom: "-10%",
          right: "-10%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(184,122,90,0.1) 0%, transparent 70%)",
        }}
      />

      <div className="text-center max-w-2xl fade-in relative z-10">
        {/* Badge */}
        <div
          className="inline-block px-4 py-1.5 text-xs font-mono tracking-widest uppercase mb-8 rounded-full"
          style={{
            background: "linear-gradient(135deg, #fce8ed, #fdf0f3)",
            border: "1.5px solid #f0c8d4",
            color: "#c9607a",
          }}
        >
          ✨ Private · Just Harshit & Khushi
        </div>

        <h1 className="font-display text-6xl md:text-7xl font-bold leading-none mb-4"
          style={{ color: "var(--ink)" }}>
          Mock
          <span style={{ color: "var(--accent)" }}>.</span>
          <br />
          Tracker
        </h1>

        <p style={{ color: "var(--muted)" }} className="text-lg mb-12 font-light leading-relaxed">
          Log your mock exams, track accuracy & scores,
          <br />
          visualise your progress, and share study material.
        </p>

        {/* User buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard?user=user1"
            style={{
              textDecoration: "none",
              background: "linear-gradient(135deg, #c9607a 0%, #a04060 100%)",
              color: "white",
              padding: "14px 36px",
              borderRadius: "12px",
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: "0.9rem",
              letterSpacing: "0.05em",
              boxShadow: "0 4px 16px rgba(201,96,122,0.35)",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
          >
            👤 Harshit
          </Link>
          <Link
            href="/dashboard?user=user2"
            style={{
              textDecoration: "none",
              background: "linear-gradient(135deg, #e8a0b0 0%, #c9607a 100%)",
              color: "white",
              padding: "14px 36px",
              borderRadius: "12px",
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: "0.9rem",
              letterSpacing: "0.05em",
              boxShadow: "0 4px 16px rgba(232,160,176,0.4)",
            }}
          >
            ✨ Khushi
          </Link>
        </div>

        <div className="mt-6">
          <Link
            href="/compare"
            style={{
              color: "var(--muted)",
              fontSize: "0.875rem",
              textDecoration: "underline",
              textUnderlineOffset: 4,
            }}
          >
            📊 View Comparison →
          </Link>
        </div>

        {/* Features */}
        <div
          className="mt-16 grid grid-cols-3 gap-6 text-left pt-10"
          style={{ borderTop: "1.5px solid var(--border)" }}
        >
          {[
            { icon: "📋", label: "Score Logs", desc: "Excel-like table for every mock" },
            { icon: "📈", label: "Progress Charts", desc: "Visualise trends over time" },
            { icon: "📁", label: "Study Docs", desc: "Upload & share PDFs privately" },
          ].map((f) => (
            <div key={f.label}>
              <div
                className="text-2xl mb-2 w-10 h-10 flex items-center justify-center rounded-xl"
                style={{ background: "var(--surface)" }}
              >
                {f.icon}
              </div>
              <div className="font-display font-semibold text-sm" style={{ color: "var(--ink)" }}>
                {f.label}
              </div>
              <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}