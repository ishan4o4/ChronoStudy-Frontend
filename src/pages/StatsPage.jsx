import React, { useEffect, useMemo, useState } from "react";
import { api } from "../utils/api.js";

const horizons = [
  { label: "7 days", days: 7 },
  { label: "30 days", days: 30 },
  { label: "90 days", days: 90 },
  { label: "1 year", days: 365 }
];

const StatsPage = () => {
  const [dailyStats, setDailyStats] = useState([]);
  const [summary, setSummary] = useState({ totalMinutes: 0, totalHours: 0, completedTasks: 0 });
  const [targetDailyMinutes, setTargetDailyMinutes] = useState(120);

  useEffect(() => {
    const load = async () => {
      try {
        const [summaryRes, dailyRes] = await Promise.all([
          api.get("/stats/summary"),
          api.get("/stats/daily")
        ]);
        setSummary({
          totalMinutes: summaryRes.data.totalMinutes,
          totalHours: summaryRes.data.totalHours,
          completedTasks: summaryRes.data.completedTasks
        });
        setDailyStats(dailyRes.data);
      } catch (error) {
        console.error("Stats page error", error);
      }
    };
    load();
  }, []);

  const avgDailyMinutes = useMemo(() => {
    if (!dailyStats.length) return 0;
    const total = dailyStats.reduce((sum, d) => sum + (d.totalMinutes || 0), 0);
    return total / dailyStats.length;
  }, [dailyStats]);

  const handleSlider = (e) => {
    setTargetDailyMinutes(Number(e.target.value) || 0);
  };

  const handleInput = (e) => {
    const val = Number(e.target.value) || 0;
    setTargetDailyMinutes(val);
  };

  const rows = horizons.map((h) => {
    const targetHours = (targetDailyMinutes * h.days) / 60;
    const paceHours = (avgDailyMinutes * h.days) / 60;
    return {
      ...h,
      targetHours: Number.isFinite(targetHours) ? targetHours : 0,
      paceHours: Number.isFinite(paceHours) ? paceHours : 0
    };
  });

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <div className="neo-card p-4">
          <p className="text-xs text-slate-400 mb-1">Lifetime study time</p>
          <p className="text-3xl font-semibold text-slate-50">
            {summary.totalHours?.toFixed ? summary.totalHours.toFixed(1) : summary.totalHours}h
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Based on all logged sessions and completed tasks.
          </p>
        </div>
        <div className="neo-card p-4">
          <p className="text-xs text-slate-400 mb-1">Last 7 days · avg per day</p>
          <p className="text-3xl font-semibold text-neon-blue">
            {avgDailyMinutes ? (avgDailyMinutes / 60).toFixed(2) : "0.00"}h
          </p>
          <p className="mt-1 text-xs text-slate-400">
            That&apos;s {Math.round(avgDailyMinutes)} minutes of focus per day recently.
          </p>
        </div>
        <div className="neo-card p-4">
          <p className="text-xs text-slate-400 mb-1">Tasks completed</p>
          <p className="text-3xl font-semibold text-emerald-400">
            {summary.completedTasks ?? 0}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Each completed task also boosts your tracked time.
          </p>
        </div>
      </section>

      <section className="neo-card p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 mb-1">Daily study goal simulator</p>
            <p className="text-sm text-slate-200">
              Slide to select how many minutes you *aim* to study per day and see how it stacks
              against your current pace.
            </p>
          </div>
          <p className="hidden md:block text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500">
            Goal checker
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="30"
              max="600"
              step="15"
              value={targetDailyMinutes}
              onChange={handleSlider}
              className="flex-1"
            />
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                step="5"
                value={targetDailyMinutes}
                onChange={handleInput}
                className="neo-input max-w-[90px]"
              />
              <span className="text-xs text-slate-400">min / day</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400">
            At your current pace of{" "}
            <span className="text-neon-blue font-semibold">
              {avgDailyMinutes ? Math.round(avgDailyMinutes) : 0} min/day
            </span>{" "}
            vs target{" "}
            <span className="text-neon-pink font-semibold">
              {Math.round(targetDailyMinutes)} min/day
            </span>
            .
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[11px] text-left border-collapse">
            <thead className="text-slate-400">
              <tr>
                <th className="border-b border-slate-800/80 pb-2 pr-4 font-medium">Window</th>
                <th className="border-b border-slate-800/80 pb-2 pr-4 font-medium">
                  If you keep current pace
                </th>
                <th className="border-b border-slate-800/80 pb-2 pr-4 font-medium">
                  If you hit your target
                </th>
                <th className="border-b border-slate-800/80 pb-2 font-medium">Difference</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const diff = row.targetHours - row.paceHours;
                return (
                  <tr key={row.label} className="border-b border-slate-900/80 last:border-0">
                    <td className="py-2 pr-4 text-slate-300">{row.label}</td>
                    <td className="py-2 pr-4 text-slate-300">
                      {row.paceHours.toFixed(1)} h
                    </td>
                    <td className="py-2 pr-4 text-neon-pink">
                      {row.targetHours.toFixed(1)} h
                    </td>
                    <td className="py-2 text-slate-300">
                      {diff >= 0 ? "+" : "-"}
                      {Math.abs(diff).toFixed(1)} h
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-slate-500">
          This is a simple projection: it assumes your pace or goal stays constant. Real life has
          ups and downs — the idea is to give you a quick *vibe check* of where your hours will land.
        </p>
      </section>
    </div>
  );
};

export default StatsPage;
