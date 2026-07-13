"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Navbar({ userName }: { userName?: string }) {
  const searchParams = useSearchParams();
  const user = userName || searchParams.get("user") || "user1";

  return (
    <nav
      style={{
        borderBottom: "1.5px solid var(--border)",
        background: "rgba(255, 245, 247, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-display font-bold text-lg tracking-tight"
          style={{ textDecoration: "none", color: "var(--ink)" }}
        >
          Mock<span style={{ color: "var(--accent)" }}>.</span>Tracker
        </Link>

        <div className="flex items-center gap-5 text-sm font-display font-semibold">
          {[
            { label: "Dashboard", href: `/dashboard?user=${user}` },
            { label: "Compare", href: "/compare" },
            { label: "Targets", href: `/targets?user=${user}` },
            { label: "Chat", href: `/chat?user=${user}` },
            { label: "Quiz", href: `/quiz?user=${user}` },
            { label: "Tracker", href: `/tracker?user=${user}` },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              style={{ textDecoration: "none", color: "var(--ink)" }}
              className="hover:text-accent transition-colors"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href={`/dashboard?user=${user === "user1" ? "user2" : "user1"}`}
            style={{
              textDecoration: "none",
              background: "linear-gradient(135deg, #fce8ed, #fdf0f3)",
              border: "1.5px solid var(--border)",
              padding: "4px 14px",
              borderRadius: "20px",
              fontSize: "0.75rem",
              color: "var(--accent)",
              fontWeight: 600,
            }}
          >
            Switch ✨
          </Link>
        </div>
      </div>
    </nav>
  );
}