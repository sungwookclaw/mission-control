"use client";

import { useState, useMemo } from "react";
import { useCron } from "@/hooks/useCron";
import type { CronJob } from "@/lib/cron";
import { formatDuration, formatTokens, getJobShortName, getDayRunsForJob } from "@/lib/cron";

function CalendarGrid({
  year,
  month,
  jobs,
  selectedDate,
  onSelectDate,
}: {
  year: number;
  month: number;
  jobs: CronJob[];
  selectedDate: Date | null;
  onSelectDate: (d: Date) => void;
}) {
  const firstDay = new Date(year, month, 1);
  const startDay = new Date(firstDay);
  startDay.setDate(startDay.getDate() - firstDay.getDay());

  const days: (Date | null)[] = [];
  const d = new Date(startDay);
  while (days.length < 42) {
    days.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }

  const today = new Date();
  const isCurrentMonth = (day: Date) => day.getFullYear() === year && day.getMonth() === month;
  const isToday = (day: Date) => day.toDateString() === today.toDateString();

  return (
    <div className="grid grid-cols-7 gap-px text-center text-xs">
      {["일", "월", "화", "수", "목", "금", "토"].map(w => (
        <div key={w} className="py-2 font-medium" style={{ color: "var(--text-tertiary)" }}>
          {w}
        </div>
      ))}
      {days.map((day, i) => {
        if (!day) return <div key={i} />;
        const inMonth = isCurrentMonth(day);
        const today_flag = isToday(day);
        const dayJobs = inMonth ? jobs.filter(j => getDayRunsForJob(j, day).length > 0) : [];
        const selected = selectedDate && day.toDateString() === selectedDate.toDateString();

        return (
          <div
            key={i}
            onClick={() => onSelectDate(day)}
            className="relative py-1.5 cursor-pointer rounded transition-colors"
            style={{
              color: inMonth ? "var(--text-primary)" : "var(--text-tertiary)",
              background: selected ? "var(--bg-tertiary)" : "transparent",
              opacity: inMonth ? 1 : 0.3,
            }}
          >
            <span
              className="inline-flex items-center justify-center w-6 h-6 rounded-full"
              style={today_flag ? { background: "var(--accent)", color: "#fff" } : {}}
            >
              {day.getDate()}
            </span>
            {dayJobs.length > 0 && (
              <div className="flex justify-center gap-0.5 mt-0.5">
                {dayJobs.slice(0, 4).map(j => {
                  const runs = getDayRunsForJob(j, day);
                  const err = runs.some(r => r.status === "error");
                  return (
                    <div
                      key={j.id}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: err ? "var(--red)" : "var(--green)" }}
                    />
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function JobListPanel({
  jobs,
  selectedJobId,
  onSelectJob,
}: {
  jobs: CronJob[];
  selectedJobId: string | null;
  onSelectJob: (id: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      {jobs.map(job => {
        const shortName = getJobShortName(job);
        const lastOk = job.lastRun?.status === "ok";
        const selected = selectedJobId === job.id;

        return (
          <div
            key={job.id}
            onClick={() => onSelectJob(job.id)}
            className="p-3 rounded-lg cursor-pointer transition-colors"
            style={{
              background: selected ? "var(--bg-tertiary)" : "var(--bg-secondary)",
              border: `1px solid ${selected ? "var(--border-hover)" : "var(--border)"}`,
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                {shortName}
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  background: lastOk ? "rgba(77,171,154,0.15)" : "rgba(224,108,117,0.15)",
                  color: lastOk ? "var(--green)" : "var(--red)",
                }}
              >
                {lastOk ? "OK" : "ERROR"}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs" style={{ color: "var(--text-tertiary)" }}>
              <span>실행 {job.totalRuns}회</span>
              {job.lastRun && (
                <span>
                  마지막: {new Date(job.lastRun.time).toLocaleDateString("ko-KR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
              {job.nextRun && (
                <span>
                  다음: {new Date(job.nextRun).toLocaleDateString("ko-KR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
            </div>
            {job.errorCount > 0 && (
              <div className="text-xs mt-1" style={{ color: "var(--red)" }}>
                에러 {job.errorCount}회
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function RunHistory({ job }: { job: CronJob }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const runs = [...job.runs].reverse();

  return (
    <div className="space-y-1.5">
      <h3 className="text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
        실행 이력 ({runs.length}건)
      </h3>
      {runs.map((run, i) => {
        const runDate = new Date(run.runAtMs);
        const isExpanded = expanded === `${i}`;
        const errRun = run.status === "error";

        return (
          <div
            key={i}
            onClick={() => setExpanded(isExpanded ? null : `${i}`)}
            className="p-2.5 rounded-lg cursor-pointer transition-colors"
            style={{
              background: "var(--bg-secondary)",
              border: `1px solid var(--border)`,
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: errRun ? "var(--red)" : "var(--green)" }}
                />
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  {runDate.toLocaleDateString("ko-KR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </span>
                {run.model && (
                  <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "var(--bg-tertiary)", color: "var(--text-tertiary)" }}>
                    {run.model}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-tertiary)" }}>
                <span>{formatDuration(run.durationMs)}</span>
                {run.usage && <span>{formatTokens(run.usage.total_tokens)} tokens</span>}
              </div>
            </div>
            {isExpanded && (
              <div className="mt-2 pt-2" style={{ borderTop: "1px solid var(--border)" }}>
                {errRun && run.error && (
                  <div className="text-xs mb-2 p-2 rounded" style={{ background: "rgba(224,108,117,0.1)", color: "var(--red)" }}>
                    {run.error}
                  </div>
                )}
                {run.summary && (
                  <div className="text-xs whitespace-pre-wrap" style={{ color: "var(--text-secondary)", maxHeight: 300, overflow: "auto" }}>
                    {run.summary}
                  </div>
                )}
                {run.usage && (
                  <div className="mt-2 text-xs flex gap-3" style={{ color: "var(--text-tertiary)" }}>
                    <span>in: {formatTokens(run.usage.input_tokens)}</span>
                    <span>out: {formatTokens(run.usage.output_tokens)}</span>
                    <span>total: {formatTokens(run.usage.total_tokens)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function Calendar() {
  const { data, loading, error } = useCron();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const jobs = useMemo(() => {
    if (!data?.jobs) return [];
    return data.jobs.sort((a, b) => (b.lastRun?.time || 0) - (a.lastRun?.time || 0));
  }, [data]);

  const selectedJob = useMemo(() => {
    if (!selectedJobId || !data) return null;
    return data.jobs.find(j => j.id === selectedJobId) || null;
  }, [selectedJobId, data]);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ color: "var(--text-tertiary)" }}>
        로딩 중...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ color: "var(--red)" }}>
        API 오류: {error}
      </div>
    );
  }

  const monthLabel = `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월`;

  return (
    <div className="flex-1 flex gap-0 overflow-hidden" style={{ height: "calc(100vh - 3.5rem)" }}>
      {/* Left: Calendar + Job List */}
      <div className="flex-1 flex flex-col border-r overflow-auto" style={{ borderColor: "var(--border)" }}>
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            캘린더
          </h2>
          <div className="flex items-center gap-3">
            <button onClick={prevMonth} className="p-1 rounded hover:opacity-80" style={{ color: "var(--text-secondary)" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 4l-4 4 4 4" /></svg>
            </button>
            <span className="text-sm font-medium min-w-[120px] text-center" style={{ color: "var(--text-primary)" }}>
              {monthLabel}
            </span>
            <button onClick={nextMonth} className="p-1 rounded hover:opacity-80" style={{ color: "var(--text-secondary)" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 4l4 4-4 4" /></svg>
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-4">
          <CalendarGrid
            year={currentDate.getFullYear()}
            month={currentDate.getMonth()}
            jobs={jobs}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 px-4 py-2 border-t" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-tertiary)" }}>
            <div className="w-2 h-2 rounded-full" style={{ background: "var(--green)" }} /> 정상
          </div>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-tertiary)" }}>
            <div className="w-2 h-2 rounded-full" style={{ background: "var(--red)" }} /> 에러
          </div>
          <div className="ml-auto text-xs" style={{ color: "var(--text-tertiary)" }}>
            10초 자동 리프레시
          </div>
        </div>

        {/* Job List */}
        <div className="flex-1 overflow-auto p-4 border-t" style={{ borderColor: "var(--border)" }}>
          <h3 className="text-sm font-medium mb-3" style={{ color: "var(--text-secondary)" }}>
            크론잡 목록 ({jobs.length})
          </h3>
          <JobListPanel
            jobs={jobs}
            selectedJobId={selectedJobId}
            onSelectJob={setSelectedJobId}
          />
        </div>
      </div>

      {/* Right: Job Detail */}
      <div className="w-96 flex flex-col overflow-hidden">
        {selectedJob ? (
          <>
            <div className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  {getJobShortName(selectedJob)}
                </h3>
                <button
                  onClick={() => setSelectedJobId(null)}
                  className="p-1 rounded"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4l8 8M12 4l-8 8" /></svg>
                </button>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs" style={{ color: "var(--text-tertiary)" }}>
                <div>총 실행: {selectedJob.totalRuns}회</div>
                <div>에러: {selectedJob.errorCount}회</div>
                {selectedJob.lastRun && (
                  <>
                    <div>마지막: {new Date(selectedJob.lastRun.time).toLocaleDateString("ko-KR")}</div>
                    <div>소요: {formatDuration(selectedJob.lastRun.duration)}</div>
                  </>
                )}
                {selectedJob.nextRun && (
                  <div>다음: {new Date(selectedJob.nextRun).toLocaleDateString("ko-KR")}</div>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <RunHistory job={selectedJob} />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs" style={{ color: "var(--text-tertiary)" }}>
            잡을 선택하면 이력이 표시됩니다
          </div>
        )}
      </div>
    </div>
  );
}
