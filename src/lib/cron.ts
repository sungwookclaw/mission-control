export interface CronRun {
  ts: number;
  status: "ok" | "error";
  summary: string;
  error: string;
  runAtMs: number;
  durationMs: number;
  nextRunAtMs: number;
  model: string;
  provider: string;
  usage: { input_tokens: number; output_tokens: number; total_tokens: number } | null;
}

export interface CronJob {
  id: string;
  name: string;
  schedule: string;
  lastRun: { time: number; status: string; duration: number } | null;
  nextRun: number | null;
  totalRuns: number;
  errorCount: number;
  runs: CronRun[];
}

export interface CronData {
  jobs: CronJob[];
  updatedAt: number;
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  const min = Math.floor(ms / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  return `${min}m ${sec}s`;
}

export function formatTokens(tokens: number): string {
  if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(1)}M`;
  if (tokens >= 1000) return `${(tokens / 1000).toFixed(1)}K`;
  return String(tokens);
}

export function getJobShortName(job: CronJob): string {
  const s = job.name;
  if (s.includes("FRED")) return "FRED 거시지표 수집";
  if (s.includes("OHLCV") || s.includes("일봉")) return "OHLCV 일봉 수집";
  if (s.includes("공모주") || s.includes("IPO")) return "공모주 청약 일정";
  return s.slice(0, 40);
}

export function getDayRunsForJob(job: CronJob, date: Date): CronRun[] {
  const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const dayEnd = dayStart + 86400000;
  return job.runs.filter(r => r.runAtMs >= dayStart && r.runAtMs < dayEnd);
}
