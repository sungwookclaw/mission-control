"use client";

import { useState, useEffect, useCallback } from "react";
import type { CronData } from "@/lib/cron";

const API_BASE = "/api/mission-state";

export function useCron(intervalMs = 10000) {
  const [data, setData] = useState<CronData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCron = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/cron.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json as CronData);
      setError(null);
    } catch (err) {
      console.error("[useCron] fetch error:", err);
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCron();
    const timer = setInterval(fetchCron, intervalMs);
    return () => clearInterval(timer);
  }, [fetchCron, intervalMs]);

  const getJob = useCallback((id: string) => data?.jobs.find(j => j.id === id), [data]);

  return { data, loading, error, refetch: fetchCron, getJob };
}
