"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { id: "overview", label: "개요", href: "/" },
  { id: "missions", label: "미션", href: "/board" },
  { id: "calendar", label: "캘린더", href: "/calendar" },
  { id: "projects", label: "프로젝트", href: "/projects" },
  { id: "tools", label: "도구", href: "#" },
  { id: "memory", label: "기억", href: "#" },
  { id: "settings", label: "설정", href: "#" },
];

const icons: Record<string, React.ReactNode> = {
  overview: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="1" width="6" height="6" rx="1" />
      <rect x="9" y="1" width="6" height="6" rx="1" />
      <rect x="1" y="9" width="6" height="6" rx="1" />
      <rect x="9" y="9" width="6" height="6" rx="1" />
    </svg>
  ),
  missions: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="8" r="6" />
      <path d="M8 5v3l2 2" />
    </svg>
  ),
  tools: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 2L9.5 6.5" />
      <path d="M11.5 2.5L13.5 2L14 4L12.5 5.5" />
      <path d="M6.5 9.5L2 14L1 13L5.5 8.5" />
      <path d="M8 8L10.5 5.5C11 5 11 4 10 3C9 2 8 2 7.5 2.5L5 5" />
      <path d="M5 5L2.5 7.5C2 8 2 9 3 10C4 11 5 11 5.5 10.5L8 8" />
    </svg>
  ),
  memory: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 4l6-2 6 2v8l-6 2-6-2V4z" />
      <path d="M8 2v12" />
    </svg>
  ),
  calendar: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="3" width="12" height="11" rx="1" />
      <path d="M2 7h12" />
      <path d="M5 1v3M11 1v3" />
    </svg>
  ),
  projects: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 4l6-2 6 2" />
      <path d="M2 4v8l6 2 6-2V4" />
      <path d="M8 2v12" />
    </svg>
  ),
  settings: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="8" r="2.5" />
      <path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3 3l1.5 1.5M11.5 11.5L13 13M13 3l-1.5 1.5M4.5 11.5L3 13" />
    </svg>
  ),
};

export function Sidebar() {
  const pathname = usePathname();
  const [hovered, setHovered] = useState<string | null>(null);

  const getActive = (item: typeof navItems[number]) => {
    if (item.href === "/") return pathname === "/";
    return pathname.startsWith(item.href);
  };

  return (
    <aside
      className="w-56 border-r flex flex-col shrink-0"
      style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}
    >
      {/* Logo */}
      <div
        className="h-14 flex items-center px-4 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            MC
          </div>
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            미션컨트롤
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-0.5">
        {navItems.map((item) => {
          const active = getActive(item);
          return (
            <Link
              key={item.id}
              href={item.href}
              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-sm transition-colors"
              style={{
                color: active || hovered === item.id ? "var(--text-primary)" : "var(--text-secondary)",
                background: active ? "var(--bg-tertiary)" : "transparent",
              }}
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <span style={{ color: active ? "var(--text-primary)" : "var(--text-tertiary)" }}>
                {icons[item.id]}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2 px-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
            style={{ background: "var(--bg-tertiary)", color: "var(--text-secondary)" }}
          >
            SW
          </div>
          <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            성욱
          </div>
        </div>
      </div>
    </aside>
  );
}
