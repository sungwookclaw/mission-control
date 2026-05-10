export type TaskStatus = "backlog" | "in_progress" | "in_review" | "done";

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  status: TaskStatus;
  createdAt: string;
}

export const COLUMNS: { key: TaskStatus; label: string; color: string }[] = [
  { key: "backlog", label: "Backlog", color: "var(--text-tertiary)" },
  { key: "in_progress", label: "In Progress", color: "var(--accent)" },
  { key: "in_review", label: "In Review", color: "var(--yellow)" },
  { key: "done", label: "Done", color: "var(--green)" },
];

export function generateId(): string {
  return `TASK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}
