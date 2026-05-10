// OpenClaw Gateway API client

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

const GATEWAY_URL = process.env.NEXT_PUBLIC_OPENCLAW_URL || "http://150.109.244.22:18828";
const API_TOKEN = process.env.NEXT_PUBLIC_OPENCLAW_TOKEN || "";
const STATE_BASE = "mission-state";

function headers(): HeadersInit {
  const h: HeadersInit = { "Content-Type": "application/json" };
  if (API_TOKEN) h["Authorization"] = `Bearer ${API_TOKEN}`;
  return h;
}

async function fetchJSON<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${GATEWAY_URL}/${path}`, { headers: headers() });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchProjects(): Promise<ProjectsData | null> {
  return fetchJSON<ProjectsData>(`api/workspace/${STATE_BASE}/projects.json`);
}

export async function fetchTasks(): Promise<TasksData | null> {
  return fetchJSON<TasksData>(`api/workspace/${STATE_BASE}/tasks.json`);
}

export async function fetchNotes(): Promise<NotesData | null> {
  return fetchJSON<NotesData>(`api/workspace/${STATE_BASE}/notes.json`);
}

export async function writeFile(path: string, content: string): Promise<boolean> {
  try {
    const res = await fetch(`${GATEWAY_URL}/api/workspace/${path}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify({ content }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function writeTasks(tasks: TasksData): Promise<boolean> {
  return writeFile(`${STATE_BASE}/tasks.json`, JSON.stringify(tasks, null, 2));
}

export function countByStatus(tasks: TasksData, status: TaskStatus): number {
  return tasks.filter((t) => t.status === status).length;
}
