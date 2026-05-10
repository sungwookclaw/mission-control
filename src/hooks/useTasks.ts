"use client";

import { useState, useCallback } from "react";
import { Task, TaskStatus, generateId } from "@/lib/tasks";

const STORAGE_KEY = "mc-tasks";

function loadTasks(): Task[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaultTasks();
  } catch {
    return defaultTasks();
  }
}

function saveTasks(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function defaultTasks(): Task[] {
  return [
    { id: generateId(), title: "API 스펙 정의", description: "REST API 엔드포인트 문서화", assignee: "성욱", status: "backlog", createdAt: new Date().toISOString() },
    { id: generateId(), title: "인증 모듈 구현", description: "JWT 기반 인증 시스템", assignee: "키리", status: "in_progress", createdAt: new Date().toISOString() },
    { id: generateId(), title: "대시보드 UI 리뷰", description: "Overview 컴포넌트 코드 리뷰", assignee: "트라스", status: "in_review", createdAt: new Date().toISOString() },
    { id: generateId(), title: "프로젝트 초기 설정", description: "Next.js 프로젝트 세팅", assignee: "성욱", status: "done", createdAt: new Date().toISOString() },
  ];
}

export function useTasks() {
  const [tasks, setTasksInternal] = useState<Task[]>(loadTasks);

  const setTasks = useCallback((updater: Task[] | ((prev: Task[]) => Task[])) => {
    setTasksInternal((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveTasks(next);
      return next;
    });
  }, []);

  const addTask = useCallback((title: string, description: string, assignee: string) => {
    const task: Task = {
      id: generateId(),
      title,
      description,
      assignee,
      status: "backlog",
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, task]);
  }, [setTasks]);

  const moveTask = useCallback((taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
  }, [setTasks]);

  const deleteTask = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }, [setTasks]);

  return { tasks, addTask, moveTask, deleteTask };
}
