"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  fetchProjects,
  fetchTasks,
  type Project,
  type ProjectsData,
} from "@/lib/openclaw";
import type { Task } from "@/lib/tasks";
import { countByStatus } from "@/lib/openclaw";

const API_BASE = "/api/mission-state";

const STATUS_LABELS: Record<string, string> = {
  active: "진행중",
  completed: "완료",
  "on-hold": "보류",
};

const STATUS_COLORS: Record<string, string> = {
  active: "var(--accent)",
  completed: "var(--green)",
  "on-hold": "var(--yellow)",
};

export function ProjectList() {
  const router = useRouter();
  const [projectsData, setProjectsData] = useState<ProjectsData | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newStatus, setNewStatus] = useState("active");

  const load = useCallback(async () => {
    const [p, t] = await Promise.all([fetchProjects(), fetchTasks()]);
    setProjectsData(p);
    setTasks(t || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async () => {
    if (!newName.trim() || !projectsData) return;
    const newProject: Project = {
      id: crypto.randomUUID(),
      name: newName.trim(),
      status: newStatus as Project["status"],
      createdAt: new Date().toISOString(),
      description: newDesc.trim() || undefined,
    };
    const updated = { ...projectsData, projects: [...projectsData.projects, newProject] };
    const res = await fetch(`${API_BASE}/projects.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    if (res.ok) {
      setProjectsData(updated);
      setShowCreate(false);
      setNewName("");
      setNewDesc("");
    }
  };

  const getProjectStats = (projectId: string) => {
    const pt = tasks.filter(t => t.projectId === projectId);
    const done = countByStatus(pt, "done");
    const total = pt.length;
    const progress = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, done, progress };
  };

  if (loading) {
    return <div className="flex-1 flex items-center justify-center" style={{ color: "var(--text-tertiary)" }}>로딩 중...</div>;
  }

  const projects = projectsData?.projects || [];

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>프로젝트</h2>
          <button
            onClick={() => setShowCreate(true)}
            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            + 새 프로젝트
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => {
            const stats = getProjectStats(project.id);
            const activity = projectsData?.activity
              ?.filter(a => a.projectId === project.id)
              .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())[0];

            return (
              <div
                key={project.id}
                onClick={() => router.push(`/projects/${project.id}`)}
                className="p-4 rounded-lg cursor-pointer transition-colors"
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                    {project.name}
                  </h3>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full shrink-0 ml-2"
                    style={{
                      background: `${STATUS_COLORS[project.status]}20`,
                      color: STATUS_COLORS[project.status],
                    }}
                  >
                    {STATUS_LABELS[project.status] || project.status}
                  </span>
                </div>

                {project.description && (
                  <p className="text-xs mb-3 line-clamp-2" style={{ color: "var(--text-tertiary)" }}>
                    {project.description}
                  </p>
                )}

                {/* Progress */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1" style={{ color: "var(--text-tertiary)" }}>
                    <span>진행률</span>
                    <span>{stats.progress}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-tertiary)" }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${stats.progress}%`, background: "var(--green)" }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs" style={{ color: "var(--text-tertiary)" }}>
                  <span>태스크 {stats.total}개 (완료 {stats.done})</span>
                  {activity && (
                    <span>{new Date(activity.at).toLocaleDateString("ko-KR", { month: "short", day: "numeric" })}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12 text-sm" style={{ color: "var(--text-tertiary)" }}>
            프로젝트가 없습니다. 새 프로젝트를 만들어보세요.
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)" }}>
          <div className="w-96 rounded-xl p-6" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>새 프로젝트</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="프로젝트 이름"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
              />
              <textarea
                placeholder="설명 (선택)"
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
                rows={3}
                style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
              />
              <select
                value={newStatus}
                onChange={e => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
              >
                <option value="active">진행중</option>
                <option value="completed">완료</option>
                <option value="on-hold">보류</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowCreate(false)}
                className="px-3 py-1.5 rounded-lg text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                취소
              </button>
              <button
                onClick={handleCreate}
                disabled={!newName.trim()}
                className="px-3 py-1.5 rounded-lg text-sm font-medium"
                style={{ background: "var(--accent)", color: "#fff", opacity: newName.trim() ? 1 : 0.5 }}
              >
                생성
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
