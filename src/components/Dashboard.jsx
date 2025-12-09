import React, { useEffect, useState } from "react";
import { useAuth } from "../state/AuthContext.jsx";
import { api } from "../utils/api.js";

const minutesToHoursLabel = (mins) => (mins / 60).toFixed(1);

const Dashboard = () => {
  const { user } = useAuth();

  const [summary, setSummary] = useState({
    totalHours: 0,
    totalMinutes: 0,
    todayMinutes: 0,
    completedTasks: 0
  });
  const [dailyStats, setDailyStats] = useState([]);

  // competition
  const [competitorEmail, setCompetitorEmail] = useState("");
  const [competition, setCompetition] = useState(null);
  const [competitionError, setCompetitionError] = useState("");
  const [competitionLoading, setCompetitionLoading] = useState(false);

  const loadCoreStats = async () => {
    try {
      const [summaryRes, dailyRes] = await Promise.all([
        api.get("/stats/summary"),
        api.get("/stats/daily")
      ]);

      const s = summaryRes.data || {};

      const totalMinutes =
        typeof s.totalMinutes === "number"
          ? s.totalMinutes
          : typeof s.total_minutes === "number"
          ? s.total_minutes
          : 0;

      const totalHours =
        typeof s.totalHours === "number"
          ? s.totalHours
          : totalMinutes / 60;

      const todayMinutes =
        typeof s.todayMinutes === "number"
          ? s.todayMinutes
          : typeof s.today_minutes === "number"
          ? s.today_minutes
          : 0;

      const completedTasks =
        typeof s.completedTasks === "number"
          ? s.completedTasks
          : typeof s.completed_tasks === "number"
          ? s.completed_tasks
          : 0;

      setSummary({
        totalMinutes,
        totalHours,
        todayMinutes,
        completedTasks
      });

      const daily = Array.isArray(dailyRes.data) ? dailyRes.data : [];

      const normalized = daily
        .map((d) => {
          const dateValue = d.date || d.day || d._id || d.label;
          const minutes =
            typeof d.totalMinutes === "number"
              ? d.totalMinutes
              : typeof d.total_minutes === "number"
              ? d.total_minutes
              : 0;

          const dt = dateValue ? new Date(dateValue) : null;

          return {
            date: dt,
            totalMinutes: minutes
          };
        })
        .filter((d) => d.date && !Number.isNaN(d.date.getTime()))
        .sort((a, b) => a.date - b.date);

      setDailyStats(normalized);
    } catch (error) {
      console.error("Dashboard stats error", error);
    }
  };

  useEffect(() => {
    loadCoreStats();
  }, []);

  // ---- COMPETITION LOGIC ----

  // Save competition email to backend profile
  const saveCompetitionEmail = async (email) => {
    try {
      await api.post("/auth/competition-email", { email });
    } catch (err) {
      console.error("Failed to save competition email", err);
      // not fatal for UI
    }
  };

  // Fetch competition stats; can be used for:
  // - explicit Go click (persist: true)
  // - silent auto-load on refresh (persist: false, silent: true)
  const fetchCompetition = async (emailOverride, options = {}) => {
    const { persist = false, silent = false } = options;

    const raw = (emailOverride ?? competitorEmail).trim();
    if (!raw) {
      if (!silent) {
        setCompetitionError("Please enter an email to compete with.");
        setCompetition(null);
      }
      return;
    }

    if (!silent) {
      setCompetitionLoading(true);
      setCompetitionError("");
    }

    try {
      const res = await api.get("/competition/compare", {
        params: { email: raw }
      });
      setCompetition(res.data || null);

      if (persist) {
        await saveCompetitionEmail(raw);
      }
    } catch (error) {
      console.error("Competition error", error);
      const message =
        error?.response?.data?.message || "Could not fetch competitor stats.";
      if (!silent) {
        setCompetitionError(message);
        setCompetition(null);
      }
    } finally {
      if (!silent) {
        setCompetitionLoading(false);
      }
    }
  };

  // 🔹 On mount / when user changes: load saved competition email from DB
  useEffect(() => {
    if (!user) return;

    const loadSavedEmail = async () => {
      try {
        const res = await api.get("/auth/competition-email");
        const saved = (res.data?.competitionEmail || "").trim();
        if (saved) {
          setCompetitorEmail(saved);
          // auto-fetch competition silently
          await fetchCompetition(saved, { persist: false, silent: true });
        }
      } catch (err) {
        console.error("Failed to load saved competition email", err);
      }
    };

    loadSavedEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  // Today comes directly from backend summary (timezone-aware)
  const todayMinutes = summary.todayMinutes || 0;

  const averageDailyMinutes =
    dailyStats.length > 0
      ? dailyStats.reduce((sum, d) => sum + (d.totalMinutes || 0), 0) /
        dailyStats.length
      : 0;

  const competitionBars = () => {
    if (!competition) return null;

    const todayMe = competition.today?.me || 0;
    const todayThem = competition.today?.competitor || 0;
    const weekMe = competition.week?.me || 0;
    const weekThem = competition.week?.competitor || 0;
    const monthMe = competition.month?.me || 0;
    const monthThem = competition.month?.competitor || 0;

    const maxMonth = Math.max(monthMe, monthThem, 1) || 1;
    const scale = (value) => `${Math.max(8, (value / maxMonth) * 100)}%`;

    return (
      <div className="space-y-3 text-[11px] text-slate-300">
        <div>
          <p className="text-slate-400 mb-1">Today (minutes)</p>
          <div className="flex gap-2">
            <div className="flex-1">
              <p className="mb-1">You</p>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-neon-blue"
                  style={{ width: scale(todayMe) }}
                />
              </div>
              <p className="mt-1 text-[10px] text-slate-500">
                {todayMe} min
              </p>
            </div>
            <div className="flex-1">
              <p className="mb-1">Them</p>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-neon-pink"
                  style={{ width: scale(todayThem) }}
                />
              </div>
              <p className="mt-1 text-[10px] text-slate-500">
                {todayThem} min
              </p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-slate-400 mb-1">This week (total minutes)</p>
          <div className="flex gap-2">
            <div className="flex-1">
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-neon-blue"
                  style={{ width: scale(weekMe) }}
                />
              </div>
              <p className="mt-1 text-[10px] text-slate-500">
                You: {weekMe} min
              </p>
            </div>
            <div className="flex-1">
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-neon-pink"
                  style={{ width: scale(weekThem) }}
                />
              </div>
              <p className="mt-1 text-[10px] text-slate-500">
                Them: {weekThem} min
              </p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-slate-400 mb-1">This month (total minutes)</p>
          <div className="flex gap-2">
            <div className="flex-1">
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-neon-blue"
                  style={{ width: scale(monthMe) }}
                />
              </div>
              <p className="mt-1 text-[10px] text-slate-500">
                You: {monthMe} min
              </p>
            </div>
            <div className="flex-1">
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-neon-pink"
                  style={{ width: scale(monthThem) }}
                />
              </div>
              <p className="mt-1 text-[10px] text-slate-500">
                Them: {monthThem} min
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const formatDayLabel = (dateObj) => {
    if (!dateObj || !(dateObj instanceof Date)) return "";
    if (Number.isNaN(dateObj.getTime())) return "";
    return dateObj.toLocaleDateString(undefined, { weekday: "short" });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <header>
        <p className="text-xs text-slate-500">Overview</p>
        <h1 className="text-xl md:text-2xl font-semibold text-slate-50">
          Welcome back, {user?.username || "student"} 👋
        </h1>
        <p className="text-[11px] text-slate-400 mt-1">
          See your key focus stats, streaks, and friendly competition at a glance.
        </p>
      </header>

      {/* Top stats row */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="neo-card p-4">
          <p className="text-xs text-slate-400 mb-1">Total focus time</p>
          <p className="text-3xl font-semibold text-slate-50">
            {summary.totalHours.toFixed(1)}h
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Logged from all sessions and completed tasks.
          </p>
        </div>
        <div className="neo-card p-4">
          <p className="text-xs text-slate-400 mb-1">Today</p>
          <p className="text-3xl font-semibold text-neon-blue">
            {minutesToHoursLabel(todayMinutes)}h
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Avg last {dailyStats.length || 0} days:{" "}
            {minutesToHoursLabel(averageDailyMinutes)}h / day.
          </p>
        </div>
        <div className="neo-card p-4">
          <p className="text-xs text-slate-400 mb-1">Tasks completed</p>
          <p className="text-3xl font-semibold text-emerald-400">
            {summary.completedTasks ?? 0}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Each completed task adds to your lifetime study time.
          </p>
        </div>
      </section>

      {/* Middle: competition */}
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr),minmax(0,0.9fr)]">
        <div className="neo-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 mb-1">Compete</p>
              <p className="text-sm text-slate-200">
                Compare your study hours with a friend by email.
              </p>
            </div>
            <p className="hidden md:block text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500">
              friendly duel
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                className="neo-input flex-1"
                placeholder="Friend's email (must have an account)"
                value={competitorEmail}
                onChange={(e) => setCompetitorEmail(e.target.value)}
              />
              <button
                type="button"
                onClick={() => fetchCompetition(undefined, { persist: true })}
                className="neo-button px-4"
                disabled={competitionLoading}
              >
                {competitionLoading ? "..." : "Go"}
              </button>
            </div>
            {competitionError && (
              <p className="text-[11px] text-red-400">{competitionError}</p>
            )}
            {!competition && !competitionError && (
              <p className="text-[11px] text-slate-500">
                We&apos;ll show today, this week, and this month once you add a
                valid email.
              </p>
            )}
          </div>
          {competition && (
            <div className="mt-2">
              <p className="text-[11px] text-slate-400 mb-2">
                You vs{" "}
                <span className="text-slate-200">
                  {competition.competitor?.email ||
                    competitorEmail.trim() ||
                    "friend"}
                </span>
              </p>
              {competitionBars()}
            </div>
          )}
        </div>

        <div className="neo-card p-4 space-y-3">
          <p className="text-xs text-slate-400 mb-1">Deep dive</p>
          <p className="text-sm text-slate-200">
            Use the sidebar to manage tasks, plan your calendar, and inspect
            detailed stats.
          </p>
          <ul className="mt-2 space-y-2 text-[11px] text-slate-400">
            <li>• Tasks → add, edit, and complete study tasks.</li>
            <li>• Calendar → schedule study blocks & routines.</li>
            <li>• Stats → detailed charts of focus time and streaks.</li>
          </ul>
          <p className="text-[10px] text-slate-500 mt-2">
            The dashboard stays clean and read-only so you can glance at your day
            quickly.
          </p>
        </div>
      </section>

      {/* Bottom: mini last-7-days bar chart */}
      <section className="neo-card p-4">
        <p className="text-xs text-slate-400 mb-3">
          Last {dailyStats.length || 0} days · your focus streak
        </p>
        <div className="flex items-end gap-2 h-32">
          {dailyStats.map((d) => {
            const mins = d.totalMinutes || 0;
            const height = Math.min(100, (mins / 240) * 100); // up to 4h per day
            return (
              <div
                key={d.date.toISOString()}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div className="w-full rounded-full bg-slate-800 overflow-hidden h-24 flex items-end">
                  <div
                    className="w-full rounded-full bg-neon-blue"
                    style={{ height: `${height}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-500">
                  {formatDayLabel(d.date)}
                </p>
                <p className="text-[10px] text-slate-400">
                  {Math.round(mins)}m
                </p>
              </div>
            );
          })}
          {dailyStats.length === 0 && (
            <p className="text-[11px] text-slate-500">
              No recent sessions yet. Use Tasks, Calendar, or Stats pages to log
              and explore your study time.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;