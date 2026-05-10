"use client";

import { useState } from "react";

const navItems = [
  { id: "overview", label: "개요", icon: OverviewIcon },
  { id: "missions", label: "미션", icon: MissionIcon },
  { id: "tools", label: "도구", icon: ToolIcon },
  { id: "memory", label: "기억", icon: MemoryIcon },
  { id: "settings", label: "설정", icon: SettingsIcon },
];

export function Sidebar() {
  const [active, setActive] = useState("overview");

  return (
    <aside className="w-56 border-r flex flex-col shrink-0"
      style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}
    >
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold"
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
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-sm transition-colors cursor-pointer"
            style={{
              color: active === item.id ? "var(--text-primary)" : "var(--text-secondary)",
              background: active === item.id ? "var(--bg-tertiary)" : "transparent",
            }}
          >
            <item.icon active={active === item.id} />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2 px-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
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

function OverviewIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
      stroke={active ? "var(--text-primary)" : "var(--text-tertiary)"} strokeWidth="1.5">
      <rect x="1" y="1" width="6" height="6" rx="1" />
      <rect x="9" y="1" width="6" height="6" rx="1" />
      <rect x="1" y="9" width="6" height="6" rx="1" />
      <rect x="9" y="9" width="6" height="6" rx="1" />
    </svg>
  );
}

function MissionIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
      stroke={active ? "var(--text-primary)" : "var(--text-tertiary)"} strokeWidth="1.5">
      <circle cx="8" cy="8" r="6" />
      <path d="M8 5v3l2 2" />
    </svg>
  );
}

function ToolIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
      stroke={active ? "var(--text-primary)" : "var(--text-tertiary)"} strokeWidth="1.5">
      <path d="M14 2L9.5 6.5" />
      <path d="M11.5 2.5L13.5 2L14 4L12.5 5.5" />
      <path d="M6.5 9.5L2 14L1 13L5.5 8.5" />
      <path d="M8 8L10.5 5.5C11 5 11 4 10 3C9 2 8 2 7.5 2.5L5 5" />
      <path d="M5 5L2.5 7.5C2 8 2 9 3 10C4 11 5 11 5.5 10.5L8 8" />
    </svg>
  );
}

function MemoryIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
      stroke={active ? "var(--text-primary)" : "var(--text-tertiary)"} strokeWidth="1.5">
      <path d="M2 4l6-2 6 2v8l-6 2-6-2V4z" />
      <path d="M8 2v12" />
    </svg>
  );
}

function SettingsIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
      stroke={active ? "var(--text-primary)" : "var(--text-tertiary)"} strokeWidth="1.5">
      <circle cx="8" cy="8" r="2.5" />
      <path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3 3l1.5 1.5M11.5 11.5L13 13M13 3l-1.5 1.5M4.5 11.5L3 13" />
    </svg>
  );
}
