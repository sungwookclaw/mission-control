"use client";

import { useState } from "react";

export function TopNav() {
  const [search, setSearch] = useState("");

  return (
    <header
      className="h-14 border-b flex items-center px-6 gap-4 shrink-0"
      style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}
    >
      {/* Search */}
      <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-md flex-1 max-w-md"
        style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border)" }}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.5">
          <circle cx="7" cy="7" r="5" />
          <path d="M11 11l3 3" />
        </svg>
        <input
          type="text"
          placeholder="검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none outline-none text-sm flex-1"
          style={{ color: "var(--text-primary)" }}
        />
        <kbd
          className="text-xs px-1.5 py-0.5 rounded"
          style={{ background: "var(--bg-primary)", color: "var(--text-tertiary)" }}
        >
          ⌘K
        </kbd>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 ml-auto">
        <button
          className="w-8 h-8 rounded-md flex items-center justify-center transition-colors"
          style={{ color: "var(--text-secondary)" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zM8 1v4M8 11v4M1 8h4M11 8h4" />
          </svg>
        </button>
      </div>
    </header>
  );
}
