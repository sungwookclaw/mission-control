// OpenClaw Mission State API client — proxied through Next.js API Routes

import type { TaskStatus, TasksData } from "@/lib/tasks";

export type { TaskStatus, TasksData } from "@/lib/tasks";

export interface Project {
  id: string;
  name: string;
  status: "active" | "completed" | "on-hold";
  createdAt: string;
  description?: string;
  tech?: string[];
  repo?: string;
  url?: string;
}

export interface ActivityEntry {
  id: string;
  projectId: string;
  action: string;
  agent: string;
  at: string;
}

export interface Note {
  id: string;
  content: string;
  tags?: string[];
  at: string;
}

export interface ProjectsData {
  projects: Project[];
  activity: ActivityEntry[];
}

export type NotesData = Note[];

const API_BASE = "/api/mission-state";

async function fetchJSON<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}/${path}`);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch (err) {
    console.error("[fetchJSON]", path, err);
    return null;
  }
}

export async function fetchProjects(): Promise<ProjectsData | null> {
  return fetchJSON<ProjectsData>("projects.json");
}

export async function fetchTasks(): Promise<TasksData | null> {
  return fetchJSON<TasksData>("tasks.json");
}

export async function fetchNotes(): Promise<NotesData | null> {
  return fetchJSON<NotesData>("notes.json");
}

export async function writeFile(
  path: string,
  content: string
): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/${path}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    return res.ok;
  } catch (err) {
    console.error("[writeFile]", path, err);
    return false;
  }
}

export async function writeTasks(tasks: TasksData): Promise<boolean> {
  return writeFile("tasks.json", JSON.stringify(tasks, null, 2));
}

export function countByStatus(tasks: TasksData, status: TaskStatus): number {
  return tasks.filter((t) => t.status === status).length;
}
