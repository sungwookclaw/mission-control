"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Task, TaskStatus, COLUMNS, formatDate } from "@/lib/tasks";

interface TaskBoardProps {
  tasks: Task[];
  onMove: (taskId: string, status: TaskStatus) => void;
  onAdd: (title: string, description: string, assignee: string) => void;
  onDelete: (taskId: string) => void;
}

function TaskCard({
  task,
  onDragStart,
  onDelete,
}: {
  task: Task;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDelete: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showMenu) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMenu]);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      className="rounded-lg border p-3 cursor-grab active:cursor-grabbing transition-colors group"
      style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-medium leading-snug" style={{ color: "var(--text-primary)" }}>
          {task.title}
        </span>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 flex items-center justify-center rounded"
            style={{ color: "var(--text-tertiary)" }}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="8" cy="3" r="1.5" />
              <circle cx="8" cy="8" r="1.5" />
              <circle cx="8" cy="13" r="1.5" />
            </svg>
          </button>
          {showMenu && (
            <div
              className="absolute right-0 top-6 z-10 rounded-md border py-1 min-w-[100px]"
              style={{ background: "var(--bg-tertiary)", borderColor: "var(--border)" }}
            >
              <button
                onClick={() => { onDelete(); setShowMenu(false); }}
                className="w-full text-left px-3 py-1.5 text-xs transition-colors"
                style={{ color: "var(--red)" }}
                onMouseOver={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
                onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
              >
                삭제
              </button>
            </div>
          )}
        </div>
      </div>
      {task.description && (
        <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
          {task.description}
        </p>
      )}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-1.5">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium"
            style={{ background: "var(--bg-tertiary)", color: "var(--text-secondary)" }}
          >
            {task.assignee.charAt(0)}
          </div>
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
            {task.assignee}
          </span>
        </div>
        <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
          {formatDate(task.createdAt)}
        </span>
      </div>
    </div>
  );
}

function Column({
  column,
  tasks,
  onDragStart,
  onDrop,
  onDragOver,
  onDelete,
}: {
  column: (typeof COLUMNS)[number];
  tasks: Task[];
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDelete: (taskId: string) => void;
}) {
  return (
    <div
      className="flex flex-col min-w-[280px] w-[280px]"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {/* Column header */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className="w-2 h-2 rounded-full" style={{ background: column.color }} />
        <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
          {column.label}
        </span>
        <span
          className="text-xs px-1.5 py-0.5 rounded-full"
          style={{ background: "var(--bg-tertiary)", color: "var(--text-tertiary)" }}
        >
          {tasks.length}
        </span>
      </div>

      {/* Cards */}
      <div
        className="flex-1 space-y-2 p-1 rounded-lg min-h-[200px] transition-colors"
        style={{ background: "var(--bg-primary)", border: "1px dashed var(--border)" }}
      >
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDragStart={onDragStart}
            onDelete={() => onDelete(task.id)}
          />
        ))}
      </div>
    </div>
  );
}

function AddTaskForm({ onAdd, onClose }: { onAdd: (title: string, desc: string, assignee: string) => void; onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title.trim(), description.trim(), assignee.trim() || "미지정");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)" }} onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="rounded-lg border p-5 w-[400px] space-y-4"
        style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}
      >
        <h3 className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>새 작업</h3>
        <div>
          <input
            ref={inputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목"
            className="w-full rounded-md border px-3 py-2 text-sm bg-transparent outline-none"
            style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
          />
        </div>
        <div>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="설명 (선택)"
            className="w-full rounded-md border px-3 py-2 text-sm bg-transparent outline-none"
            style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
          />
        </div>
        <div>
          <input
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            placeholder="담당자 (선택)"
            className="w-full rounded-md border px-3 py-2 text-sm bg-transparent outline-none"
            style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-md text-xs"
            style={{ color: "var(--text-secondary)" }}
          >
            취소
          </button>
          <button
            type="submit"
            className="px-3 py-1.5 rounded-md text-xs text-white"
            style={{ background: "var(--accent)" }}
          >
            생성
          </button>
        </div>
      </form>
    </div>
  );
}

export function TaskBoard({ tasks, onMove, onAdd, onDelete }: TaskBoardProps) {
  const [showForm, setShowForm] = useState(false);

  const handleDragStart = useCallback((e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("text/plain", taskId);
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(
    (status: TaskStatus) => (e: React.DragEvent) => {
      e.preventDefault();
      const taskId = e.dataTransfer.getData("text/plain");
      if (taskId) onMove(taskId, status);
    },
    [onMove]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
            Task Board
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>
            작업을 관리하고 진행 상황을 추적합니다.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-white transition-colors"
          style={{ background: "var(--accent)" }}
          onMouseOver={(e) => (e.currentTarget.style.background = "var(--accent-hover)")}
          onMouseOut={(e) => (e.currentTarget.style.background = "var(--accent)")}
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3v10M3 8h10" />
          </svg>
          새 작업
        </button>
      </div>

      {/* Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => (
          <Column
            key={col.key}
            column={col}
            tasks={tasks.filter((t) => t.status === col.key)}
            onDragStart={handleDragStart}
            onDrop={handleDrop(col.key)}
            onDragOver={handleDragOver}
            onDelete={onDelete}
          />
        ))}
      </div>

      {showForm && <AddTaskForm onAdd={onAdd} onClose={() => setShowForm(false)} />}
    </div>
  );
}
