"use client";

import { useOpenClaw } from "@/hooks/useOpenClaw";
import { countByStatus } from "@/lib/openclaw";

function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    active: "var(--accent)",
    completed: "var(--green)",
    "on-hold": "var(--yellow)",
    "진행 중": "var(--accent)",
    완료: "var(--green)",
    보류: "var(--yellow)",
  };
  const color = colorMap[status] || "var(--text-tertiary)";
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full"
      style={{ color, background: `${color}15` }}
    >
      {status}
    </span>
  );
}

function ActivityDot({ agent }: { agent: string }) {
  const colorMap: Record<string, string> = {
    trass: "var(--accent)",
    kiri: "var(--green)",
    system: "var(--orange)",
  };
  return (
    <div
      className="w-2 h-2 rounded-full shrink-0"
      style={{ background: colorMap[agent] || "var(--text-tertiary)" }}
    />
  );
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "방금";
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

export function Overview() {
  const { projects, tasks, notes, loading } = useOpenClaw();

  if (loading && !projects && !tasks) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>로딩 중…</span>
      </div>
    );
  }

  const taskList = tasks || [];
  const projectList = projects?.projects || [];
  const activityList = projects?.activity || [];
  const noteList = notes || [];

  const stats = [
    { label: "진행 중", value: String(countByStatus(taskList, "in_progress")), color: "var(--accent)" },
    { label: "완료", value: String(countByStatus(taskList, "done")), color: "var(--green)" },
    { label: "백로그", value: String(countByStatus(taskList, "backlog")), color: "var(--yellow)" },
    { label: "프로젝트", value: String(projectList.length), color: "var(--orange)" },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
          개요
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>
          시스템 상태와 최근 활동을 확인합니다.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg p-4 border"
            style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}
          >
            <div className="text-xs mb-2" style={{ color: "var(--text-tertiary)" }}>
              {stat.label}
            </div>
            <div className="text-2xl font-semibold" style={{ color: stat.color }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Projects */}
        <div
          className="rounded-lg border overflow-hidden"
          style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}
        >
          <div
            className="px-4 py-3 border-b flex items-center justify-between"
            style={{ borderColor: "var(--border)" }}
          >
            <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              프로젝트
            </span>
            <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              {projectList.length}개
            </span>
          </div>
          <div>
            {projectList.length === 0 && (
              <div className="px-4 py-6 text-center text-xs" style={{ color: "var(--text-tertiary)" }}>
                프로젝트 없음
              </div>
            )}
            {projectList.map((p) => (
              <div
                key={p.id}
                className="px-4 py-3 flex items-center justify-between border-b last:border-b-0"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono" style={{ color: "var(--text-tertiary)" }}>
                    {p.id}
                  </span>
                  <span className="text-sm" style={{ color: "var(--text-primary)" }}>
                    {p.name}
                  </span>
                </div>
                <StatusBadge status={p.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div
          className="rounded-lg border overflow-hidden"
          style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}
        >
          <div
            className="px-4 py-3 border-b"
            style={{ borderColor: "var(--border)" }}
          >
            <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              활동
            </span>
          </div>
          <div>
            {activityList.length === 0 && (
              <div className="px-4 py-6 text-center text-xs" style={{ color: "var(--text-tertiary)" }}>
                활동 없음
              </div>
            )}
            {activityList.map((a) => (
              <div
                key={a.id}
                className="px-4 py-3 flex items-center gap-3 border-b last:border-b-0"
                style={{ borderColor: "var(--border)" }}
              >
                <ActivityDot agent={a.agent} />
                <div className="flex-1 min-w-0">
                  <span className="text-sm truncate block" style={{ color: "var(--text-primary)" }}>
                    {a.action}
                  </span>
                  <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                    {a.agent}
                  </span>
                </div>
                <span className="text-xs shrink-0" style={{ color: "var(--text-tertiary)" }}>
                  {timeAgo(a.at)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notes */}
      {noteList.length > 0 && (
        <div
          className="rounded-lg border overflow-hidden"
          style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}
        >
          <div
            className="px-4 py-3 border-b"
            style={{ borderColor: "var(--border)" }}
          >
            <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              최근 노트
            </span>
          </div>
          <div>
            {noteList.map((n) => (
              <div
                key={n.id}
                className="px-4 py-3 flex items-start gap-3 border-b last:border-b-0"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex-1">
                  <span className="text-sm" style={{ color: "var(--text-primary)" }}>
                    {n.content}
                  </span>
                  {n.tags && n.tags.length > 0 && (
                    <div className="flex gap-1 mt-1.5">
                      {n.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-1.5 py-0.5 rounded-full"
                          style={{ background: "var(--bg-tertiary)", color: "var(--text-tertiary)" }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-xs shrink-0" style={{ color: "var(--text-tertiary)" }}>
                  {timeAgo(n.at)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
