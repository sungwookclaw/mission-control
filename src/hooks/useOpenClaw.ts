"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  ProjectsData,
  TasksData,
  NotesData,
  fetchProjects,
  fetchTasks,
  fetchNotes,
} from "@/lib/openclaw";

const POLL_MS = 10_000;

export function useOpenClaw() {
  const [projects, setProjects] = useState<ProjectsData | null>(null);
  const [tasks, setTasks] = useState<TasksData | null>(null);
  const [notes, setNotes] = useState<NotesData | null>(null);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  const refresh = useCallback(async () => {
    const [p, t, n] = await Promise.all([fetchProjects(), fetchTasks(), fetchNotes()]);
    if (!mounted.current) return;
    if (p) setProjects(p);
    if (t) setTasks(t);
    if (n) setNotes(n);
    setLoading(false);
  }, []);

  useEffect(() => {
    mounted.current = true;
    refresh();
    const id = setInterval(refresh, POLL_MS);
    return () => {
      mounted.current = false;
      clearInterval(id);
    };
  }, [refresh]);

  return { projects, tasks, notes, loading, refresh };
}
