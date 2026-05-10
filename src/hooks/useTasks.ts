"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Task, TaskStatus, TasksData, generateId } from "@/lib/tasks";
import {
  fetchTasks,
  writeTasks as apiWriteTasks,
} from "@/lib/openclaw";

const STORAGE_KEY = "mc-tasks";
const POLL_MS = 10_000;

function loadLocalTasks(): TasksData {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocal(tasks: TasksData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function useTasks() {
  const [tasks, setTasksInternal] = useState<TasksData>(loadLocalTasks);
  const mounted = useRef(true);

  // Fetch from server on mount + poll
  useEffect(() => {
    mounted.current = true;

    const load = async () => {
      const data = await fetchTasks();
      if (!mounted.current) return;
      if (data) {
        setTasksInternal(data);
        saveLocal(data);
      }
    };

    load();
    const interval = setInterval(load, POLL_MS);
    return () => {
      mounted.current = false;
      clearInterval(interval);
    };
  }, []);

  const persist = useCallback(async (next: TasksData) => {
    setTasksInternal(next);
    saveLocal(next);
    apiWriteTasks(next);
  }, []);

  const addTask = useCallback(
    (title: string, description: string, assignee: string) => {
      const task: Task = {
        id: generateId(),
        title,
        description,
        assignee,
        status: "backlog",
        createdAt: new Date().toISOString(),
      };
      persist([...tasks, task]);
    },
    [tasks, persist]
  );

  const moveTask = useCallback(
    (taskId: string, newStatus: TaskStatus) => {
      const next = tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t));
      persist(next);
    },
    [tasks, persist]
  );

  const deleteTask = useCallback(
    (taskId: string) => {
      const next = tasks.filter((t) => t.id !== taskId);
      persist(next);
    },
    [tasks, persist]
  );

  return { tasks, addTask, moveTask, deleteTask };
}
