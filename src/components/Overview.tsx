"use client";

const stats = [
  { label: "진행 중", value: "3", color: "var(--accent)" },
  { label: "완료", value: "12", color: "var(--green)" },
  { label: "보류", value: "2", color: "var(--yellow)" },
  { label: "도구", value: "5", color: "var(--orange)" },
];

const recentMissions = [
  { id: "MC-1", title: "미션컨트롤 대시보드 구축", status: "진행 중", priority: "높음", date: "오늘" },
  { id: "MC-2", title: "기억 전략 수립", status: "완료", priority: "중간", date: "오늘" },
  { id: "MC-3", title: "GitHub/Vercel 연동", status: "완료", priority: "높음", date: "오늘" },
];

const recentActivity = [
  { action: "미션컨트롤 레포지토리 생성", time: "2분 전", type: "system" },
  { action: "기억 전략 논의 완료", time: "1시간 전", type: "memory" },
  { action: "팀 에이전트 정리 완료", time: "오늘" , type: "system" },
];

export function Overview() {
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
        {/* Recent Missions */}
        <div className="rounded-lg border overflow-hidden"
          style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}
        >
          <div className="px-4 py-3 border-b flex items-center justify-between"
            style={{ borderColor: "var(--border)" }}
          >
            <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              최근 미션
            </span>
            <button className="text-xs" style={{ color: "var(--accent)" }}>
              전체 보기
            </button>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {recentMissions.map((m) => (
              <div key={m.id} className="px-4 py-3 flex items-center justify-between"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono" style={{ color: "var(--text-tertiary)" }}>
                    {m.id}
                  </span>
                  <span className="text-sm" style={{ color: "var(--text-primary)" }}>
                    {m.title}
                  </span>
                </div>
                <StatusBadge status={m.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="rounded-lg border overflow-hidden"
          style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}
        >
          <div className="px-4 py-3 border-b"
            style={{ borderColor: "var(--border)" }}
          >
            <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              활동
            </span>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {recentActivity.map((a, i) => (
              <div key={i} className="px-4 py-3 flex items-center gap-3"
                style={{ borderColor: "var(--border)" }}
              >
                <ActivityDot type={a.type} />
                <div className="flex-1">
                  <span className="text-sm" style={{ color: "var(--text-primary)" }}>
                    {a.action}
                  </span>
                </div>
                <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                  {a.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    "진행 중": "var(--accent)",
    "완료": "var(--green)",
    "보류": "var(--yellow)",
  };
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full"
      style={{
        color: colorMap[status] || "var(--text-tertiary)",
        background: `${colorMap[status] || "var(--text-tertiary)"}15`,
      }}
    >
      {status}
    </span>
  );
}

function ActivityDot({ type }: { type: string }) {
  const colorMap: Record<string, string> = {
    system: "var(--accent)",
    memory: "var(--green)",
    mission: "var(--orange)",
  };
  return (
    <div
      className="w-2 h-2 rounded-full shrink-0"
      style={{ background: colorMap[type] || "var(--text-tertiary)" }}
    />
  );
}
