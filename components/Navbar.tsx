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
        background: "var(--paper)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div className="flex items-center gap-5 text-sm font-display font-semibold">
          <Link
            href={`/dashboard?user=${user}`}
            className="hover:text-accent transition-colors"
            style={{ textDecoration: "none", color: "var(--ink)" }}
          >
            Dashboard
          </Link>
          <Link
            href="/compare"
            className="hover:text-accent transition-colors"
            style={{ textDecoration: "none", color: "var(--ink)" }}
          >
            Compare
          </Link>
          <Link
            href={`/targets?user=${user}`}
            className="hover:text-accent transition-colors"
            style={{ textDecoration: "none", color: "var(--ink)" }}
          >
            Targets
          </Link>
          <Link
            href={`/chat?user=${user}`}
            className="hover:text-accent transition-colors"
            style={{ textDecoration: "none", color: "var(--ink)" }}
          >
            Chat
          </Link>
          <Link
            href={`/dashboard?user=${user === "user1" ? "user2" : "user1"}`}
            style={{
              textDecoration: "none",
              background: "var(--surface)",
              border: "1.5px solid var(--border)",
              padding: "4px 14px",
              borderRadius: "20px",
              fontSize: "0.75rem",
              color: "var(--muted)",
            }}
          >
            Switch User
          </Link>
        </div>
    </nav>
  );
}
