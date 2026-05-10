"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  fetchProjects,
  fetchTasks,
  fetchNotes,
  type Project,
  type ProjectsData,
  type NotesData,
} from "@/lib/openclaw";
import { COLUMNS, type Task } from "@/lib/tasks";
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


export function ProjectDetail() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [projectsData, setProjectsData] = useState<ProjectsData | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<NotesData>([]);
  const [loading, setLoading] = useState(true);

  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const project = projectsData?.projects.find(p => p.id === projectId);
  const projectTasks = tasks.filter(t => t.projectId === projectId);
  const projectNotes = notes.filter(n => n.content?.includes(projectId));

  const load = useCallback(async () => {
    const [p, t, n] = await Promise.all([fetchProjects(), fetchTasks(), fetchNotes()]);
    setProjectsData(p);
    setTasks(t || []);
    setNotes(n || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateProject = useCallback(async (updates: Partial<Project>) => {
    if (!projectsData || !project) return;
    const updated = {
      ...projectsData,
      projects: projectsData.projects.map(p => p.id === projectId ? { ...p, ...updates } : p),
    };
    const res = await fetch(`${API_BASE}/projects.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    if (res.ok) {
      setProjectsData(updated);
    }
  }, [projectsData, project, projectId]);

  const handleSaveField = (field: string) => {
    if (field === "name") updateProject({ name: editValue });
    if (field === "description") updateProject({ description: editValue || undefined });
    if (field === "status") updateProject({ status: editValue as Project["status"] });
    setEditingField(null);
  };

  const doneCount = countByStatus(projectTasks, "done");
  const progress = projectTasks.length > 0 ? Math.round((doneCount / projectTasks.length) * 100) : 0;

  if (loading) {
    return <div className="flex-1 flex items-center justify-center" style={{ color: "var(--text-tertiary)" }}>로딩 중...</div>;
  }

  if (!project) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm mb-3" style={{ color: "var(--text-tertiary)" }}>프로젝트를 찾을 수 없습니다</p>
          <button
            onClick={() => router.push("/projects")}
            className="text-sm"
            style={{ color: "var(--accent)" }}
          >
            목록으로
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/projects")}
            className="flex items-center gap-1 text-xs mb-3"
            style={{ color: "var(--text-tertiary)" }}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 4l-4 4 4 4" /></svg>
            프로젝트 목록
          </button>

          <div className="flex items-start gap-3">
            <div className="flex-1">
              {editingField === "name" ? (
                <input
                  autoFocus
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  onBlur={() => handleSaveField("name")}
                  onKeyDown={e => e.key === "Enter" && handleSaveField("name")}
                  className="text-xl font-bold w-full outline-none px-1 py-0.5 rounded"
                  style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)" }}
                />
              ) : (
                <h1
                  onClick={() => { setEditingField("name"); setEditValue(project.name); }}
                  className="text-xl font-bold cursor-pointer px-1 py-0.5 rounded hover:opacity-80"
                  style={{ color: "var(--text-primary)" }}
                >
                  {project.name}
                </h1>
              )}

              {editingField === "description" ? (
                <textarea
                  autoFocus
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  onBlur={() => handleSaveField("description")}
                  onKeyDown={e => { if (e.key === "Enter" && e.metaKey) handleSaveField("description"); }}
                  className="text-sm w-full outline-none px-2 py-1 rounded mt-1 resize-none"
                  rows={2}
                  style={{ background: "var(--bg-tertiary)", color: "var(--text-secondary)" }}
                />
              ) : (
                <p
                  onClick={() => { setEditingField("description"); setEditValue(project.description || ""); }}
                  className="text-sm mt-1 px-1 py-0.5 rounded cursor-pointer hover:opacity-80"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {project.description || "설명 추가..."}
                </p>
              )}
            </div>

            {/* Status */}
            {editingField === "status" ? (
              <select
                autoFocus
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                onBlur={() => handleSaveField("status")}
                className="text-xs px-2 py-1 rounded-lg outline-none"
                style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)" }}
              >
                <option value="active">진행중</option>
                <option value="completed">완료</option>
                <option value="on-hold">보류</option>
              </select>
            ) : (
              <span
                onClick={() => { setEditingField("status"); setEditValue(project.status); }}
                className="text-xs px-2.5 py-1 rounded-full cursor-pointer"
                style={{
                  background: `${STATUS_COLORS[project.status]}20`,
                  color: STATUS_COLORS[project.status],
                }}
              >
                {STATUS_LABELS[project.status]}
              </span>
            )}
          </div>

          {/* Progress */}
          <div className="mt-4 p-3 rounded-lg" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between text-xs mb-2" style={{ color: "var(--text-tertiary)" }}>
              <span>진행률</span>
              <span>{doneCount}/{projectTasks.length} 태스크 완료 ({progress}%)</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--bg-tertiary)" }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${progress}%`, background: "var(--green)" }}
              />
            </div>
          </div>
        </div>

        {/* Tasks */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>
            관련 태스크 ({projectTasks.length})
          </h2>
          {projectTasks.length > 0 ? (
            <div className="space-y-1.5">
              {projectTasks.map(task => {
                const col = COLUMNS.find(c => c.key === task.status);
                return (
                  <div
                    key={task.id}
                    onClick={() => router.push("/board")}
                    className="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors"
                    style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ background: col?.color || "var(--text-tertiary)" }} />
                      <span className="text-sm" style={{ color: "var(--text-primary)" }}>{task.title}</span>
                    </div>
                    <span className="text-xs" style={{ color: col?.color || "var(--text-tertiary)" }}>
                      {col?.label || task.status}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>관련 태스크가 없습니다</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>
            노트 ({projectNotes.length})
          </h2>
          {projectNotes.length > 0 ? (
            <div className="space-y-2">
              {projectNotes.map(note => (
                <div key={note.id} className="p-3 rounded-lg" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
                  <p className="text-xs whitespace-pre-wrap" style={{ color: "var(--text-secondary)" }}>{note.content}</p>
                  <div className="mt-2 text-xs" style={{ color: "var(--text-tertiary)" }}>
                    {new Date(note.at).toLocaleDateString("ko-KR")}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>노트가 없습니다</p>
          )}
        </div>
      </div>
    </div>
  );
}
