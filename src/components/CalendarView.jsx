import React, { useEffect, useMemo, useState } from "react";
import { api } from "../utils/api.js";

const VIEW_TYPES = [
  { id: "day", label: "Day" },
  { id: "week", label: "Week" },
  { id: "month", label: "Month" }
];

const formatDateKey = (date) => date.toISOString().slice(0, 10);

const humanDate = (dateStr) => {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric"
  });
};

const formatRecurrenceLabel = (rule) => {
  try {
    const parts = rule.split(";").reduce((acc, part) => {
      const [k, v] = part.split("=");
      acc[k] = v;
      return acc;
    }, {});

    const freq = (parts.FREQ || "").toLowerCase();
    const interval = Number(parts.INTERVAL || 1) || 1;
    const count = Number(parts.COUNT || 0) || 0;

    let unitLabel = "day";
    if (freq === "weekly") unitLabel = "week";
    if (freq === "monthly") unitLabel = "month";

    const everyText =
      interval === 1 ? `Every ${unitLabel}` : `Every ${interval} ${unitLabel}s`;
    const countText = count ? ` · ${count} times` : "";
    return `${everyText}${countText}`;
  } catch {
    return rule.toLowerCase();
  }
};

const CalendarView = ({ showEditor = true }) => {
  const [events, setEvents] = useState([]);
  const [viewType, setViewType] = useState("week");
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().slice(0, 10)
  );

  const [tab, setTab] = useState("task");
  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [description, setDescription] = useState("");
  const [allDay, setAllDay] = useState(false);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("09:00");

  const [repeatMode, setRepeatMode] = useState("none");
  const [repeatInterval, setRepeatInterval] = useState(1);
  const [repeatCount, setRepeatCount] = useState(10);
  const [showCustom, setShowCustom] = useState(false);
  const [customUnit, setCustomUnit] = useState("week"); 
  const [customEvery, setCustomEvery] = useState(1);
  const [customEndMode, setCustomEndMode] = useState("after");
  const [customEndCount, setCustomEndCount] = useState(8);

  const [saving, setSaving] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);

  // Subjects from backend
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [subjectSaving, setSubjectSaving] = useState(false);

  useEffect(() => {
    setDate(selectedDate);
  }, [selectedDate]);

  const loadSubjects = async () => {
    try {
      const res = await api.get("/subjects");
      setSubjects(res.data);
    } catch (error) {
      console.error("Subjects load error", error);
    }
  };

  const addSubject = async () => {
    const trimmed = newSubject.trim();
    if (!trimmed) return;
    setSubjectSaving(true);
    try {
      const res = await api.post("/subjects", { name: trimmed });
      setSubjects((prev) => [...prev, res.data]);
      setSubjectId(res.data._id);
      setNewSubject("");
    } catch (error) {
      console.error("Add subject error", error);
    } finally {
      setSubjectSaving(false);
    }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  const computeRange = () => {
    const base = new Date(selectedDate + "T00:00:00");
    if (viewType === "day") {
      const from = new Date(base);
      const to = new Date(base);
      to.setHours(23, 59, 59, 999);
      return { from, to };
    }
    if (viewType === "week") {
      const day = base.getDay(); 
      const mondayOffset = (day + 6) % 7;
      const from = new Date(base);
      from.setDate(from.getDate() - mondayOffset);
      const to = new Date(from);
      to.setDate(to.getDate() + 6);
      to.setHours(23, 59, 59, 999);
      return { from, to };
    }
    const from = new Date(base.getFullYear(), base.getMonth(), 1);
    const to = new Date(base.getFullYear(), base.getMonth() + 1, 0);
    to.setHours(23, 59, 59, 999);
    return { from, to };
  };

  const loadEvents = async () => {
    try {
      setLoadingEvents(true);
      const { from, to } = computeRange();
      const res = await api.get("/events", {
        params: {
          from: from.toISOString(),
          to: to.toISOString()
        }
      });
      setEvents(res.data);
    } catch (error) {
      console.error("Events error", error);
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [viewType, selectedDate]);

  const groupedEvents = useMemo(() => {
    const groups = {};
    for (const ev of events) {
      const d = new Date(ev.start);
      const key = formatDateKey(d);
      if (!groups[key]) groups[key] = [];
      groups[key].push(ev);
    }
    Object.values(groups).forEach((list) =>
      list.sort((a, b) => new Date(a.start) - new Date(b.start))
    );
    const sortedKeys = Object.keys(groups).sort();
    return { groups, sortedKeys };
  }, [events]);

  const todayLabel = useMemo(() => {
    const d = new Date(selectedDate + "T00:00:00");
    if (viewType === "day") {
      return d.toLocaleDateString(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric"
      });
    }
    if (viewType === "week") {
      const { from, to } = computeRange();
      return `${from.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric"
      })} – ${to.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric"
      })}`;
    }
    return d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  }, [selectedDate, viewType]);

  const jumpToday = () => {
    const iso = new Date().toISOString().slice(0, 10);
    setSelectedDate(iso);
  };

  const nudgeDate = (direction) => {
    const base = new Date(selectedDate + "T00:00:00");
    if (viewType === "day") {
      base.setDate(base.getDate() + direction);
    } else if (viewType === "week") {
      base.setDate(base.getDate() + 7 * direction);
    } else {
      base.setMonth(base.getMonth() + direction);
    }
    setSelectedDate(base.toISOString().slice(0, 10));
  };

  const currentRepeatLabel = () => {
    if (repeatMode === "none") return "Does not repeat";
    if (repeatMode === "daily") return "Daily";
    if (repeatMode === "weekly") return "Weekly";
    if (repeatMode === "monthly") return "Monthly";
    if (repeatMode === "custom") {
      return `Custom · every ${repeatInterval} ${
        customUnit === "day" ? "day" : customUnit === "week" ? "week" : "month"
      }`;
    }
    return "Does not repeat";
  };

  const openCustom = () => {
    setShowCustom(true);
    setCustomEvery(repeatInterval || 1);
    setCustomEndCount(repeatCount || 8);
    setCustomUnit(
      repeatMode === "daily" ? "day" : repeatMode === "monthly" ? "month" : "week"
    );
  };

  const applyCustom = () => {
    setRepeatMode("custom");
    setRepeatInterval(customEvery || 1);
    setRepeatCount(customEndCount || 8);
    setShowCustom(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const baseDate = date || selectedDate;
      let start;
      let end;

      if (allDay) {
        start = new Date(baseDate);
        start.setHours(0, 0, 0, 0);
        end = new Date(baseDate);
        end.setHours(23, 59, 0, 0);
      } else {
        const [sh, sm] = startTime.split(":").map(Number);
        const [eh, em] = endTime.split(":").map(Number);
        start = new Date(baseDate);
        start.setHours(sh, sm, 0, 0);
        end = new Date(baseDate);
        end.setHours(eh, em, 0, 0);
      }

      let backendRepeatType = "none";
      if (repeatMode === "daily" || (repeatMode === "custom" && customUnit === "day")) {
        backendRepeatType = "daily";
      } else if (
        repeatMode === "weekly" ||
        (repeatMode === "custom" && customUnit === "week")
      ) {
        backendRepeatType = "weekly";
      } else if (
        repeatMode === "monthly" ||
        (repeatMode === "custom" && customUnit === "month")
      ) {
        backendRepeatType = "monthly";
      }

      const subjectName =
        subjects.find((s) => s._id === subjectId)?.name || "";

      const payload = {
        title: title || (tab === "task" ? "Study task" : "Event"),
        type: tab === "task" ? "study" : "class",
        subject: subjectName || "",
        description,
        start,
        end,
        repeatType: backendRepeatType,
        repeatInterval:
          backendRepeatType === "none"
            ? 1
            : repeatMode === "custom"
            ? customEvery || 1
            : 1,
        repeatCount:
          backendRepeatType === "none"
            ? 1
            : repeatMode === "custom"
            ? customEndCount || 8
            : repeatCount || 10
      };

      await api.post("/events", payload);

      setTitle("");
      setDescription("");
      setAllDay(false);
      setRepeatMode("none");
      setRepeatInterval(1);
      setRepeatCount(10);

      await loadEvents();
    } catch (error) {
      console.error("Create event error", error);
    } finally {
      setSaving(false);
    }
  };

  const deleteEvent = async (ev) => {
    if (ev.isRecurring && ev.seriesId) {
      const deleteSeries = window.confirm(
        "This is part of a repeating schedule. Click OK to delete the entire series, or Cancel to delete just this one."
      );
      try {
        if (deleteSeries) {
          await api.delete(`/events/series/${ev.seriesId}`);
        } else {
          await api.delete(`/events/${ev._id}`);
        }
        await loadEvents();
      } catch (error) {
        console.error("Delete event error", error);
      }
      return;
    }

    if (!window.confirm("Delete this event?")) return;
    try {
      await api.delete(`/events/${ev._id}`);
      await loadEvents();
    } catch (error) {
      console.error("Delete event error", error);
    }
  };

  // -------------------- RENDER --------------------
  return (
    <div
      className={
        showEditor
          ? "grid gap-4 lg:grid-cols-[minmax(0,1.3fr),minmax(0,1fr)]"
          : ""
      }
    >
      {/* Left: agenda view */}
      <div className={showEditor ? "neo-card p-4" : ""}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <p className="text-xs text-slate-400">Schedule</p>
            <p className="text-sm text-slate-200">{todayLabel}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={jumpToday}
              className="rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1 text-[11px] text-s
late-200 hover:border-neon-blue/70"
            >
              Today
            </button>
            <button
              onClick={() => nudgeDate(-1)}
              className="rounded-full border border-slate-700/80 bg-slate-900/80 px-2 py-1 text-[11px]"
            >
              ‹
            </button>
            <button
              onClick={() => nudgeDate(1)}
              className="rounded-full border border-slate-700/80 bg-slate-900/80 px-2 py-1 text-[11px]"
            >
              ›
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="neo-input max-w-[140px]"
            />
            <div className="flex rounded-full border border-slate-700/80 bg-slate-900/80 p-0.5 text-[11px]">
              {VIEW_TYPES.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setViewType(v.id)}
                  className={[
                    "px-2 py-1 rounded-full",
                    viewType === v.id
                      ? "bg-slate-800 text-slate-50"
                      : "text-slate-400 hover:text-slate-100"
                  ].join(" ")}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-3 max-h-72 overflow-y-auto">
          {loadingEvents && (
            <p className="text-[11px] text-slate-500 mb-2">Loading events…</p>
          )}
          {events.length === 0 && !loadingEvents && (
            <p className="text-xs text-slate-500">
              No events in this range. Add a study block using the panel on the
              calendar page.
            </p>
          )}
          {groupedEvents.sortedKeys.map((dateKey) => (
            <div key={dateKey} className="mb-3">
              <p className="text-[11px] text-slate-400 mb-1">
                {humanDate(dateKey)}
              </p>
              <div className="space-y-1">
                {groupedEvents.groups[dateKey].map((ev) => {
                  const start = new Date(ev.start);
                  const end = new Date(ev.end);
                  const timeLabel = `${start
                    .toTimeString()
                    .slice(0, 5)} – ${end.toTimeString().slice(0, 5)}`;
                  const recurringLabel =
                    ev.isRecurring && ev.recurrenceRule
                      ? formatRecurrenceLabel(ev.recurrenceRule)
                      : null;

                  return (
                    <div
                      key={ev._id}
                      className="rounded-2xl border border-slate-700/80 bg-slate-900/80 px-3 py-2 text-[11px] flex justify-between items-center gap-2"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-slate-100">
                          {ev.title}
                          {ev.subject ? (
                            <span className="text-[10px] text-neon-blue ml-2">
                              · {ev.subject}
                            </span>
                          ) : null}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {timeLabel} · {ev.type}
                          {recurringLabel && (
                            <span className="ml-2 text-[10px] text-neon-pink">
                              ({recurringLabel})
                            </span>
                          )}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteEvent(ev)}
                        className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-red-500/70 text-[11px] text-red-300 hover:bg-red-500/20"
                        title="Delete event"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: scheduling panel (hidden on dashboard / compact use) */}
      {showEditor && (
        <form onSubmit={onSubmit} className="neo-card p-4 flex flex-col gap-4">
          <input
            placeholder="Add title"
            className="w-full bg-transparent text-sm md:text-base text-slate-50 border-b border-slate-800/80 pb-2 outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="flex gap-2 text-xs">
            <button
              type="button"
              onClick={() => setTab("event")}
              className={`rounded-full px-3 py-1 ${
                tab === "event"
                  ? "bg-slate-800 text-slate-50"
                  : "text-slate-400 hover:bg-slate-900/80"
              }`}
            >
              Event
            </button>
            <button
              type="button"
              onClick={() => setTab("task")}
              className={`rounded-full px-3 py-1 ${
                tab === "task"
                  ? "bg-slate-800 text-slate-50"
                  : "text-slate-400 hover:bg-slate-900/80"
              }`}
            >
              Task
            </button>
            <span className="ml-auto text-[11px] text-slate-500 font-mono uppercase tracking-[0.2em]">
              Study schedule
            </span>
          </div>

          <div className="flex gap-3 text-xs items-start">
            <div className="mt-1 text-slate-400">🕒</div>
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap gap-2">
                <input
                  type="date"
                  className="neo-input max-w-[150px]"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                {!allDay && (
                  <>
                    <input
                      type="time"
                      className="neo-input max-w-[100px]"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                    <input
                      type="time"
                      className="neo-input max-w-[100px]"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </>
                )}
              </div>
              <label className="flex items-center gap-2 text-[11px] text-slate-400">
                <input
                  type="checkbox"
                  className="h-3 w-3 rounded border-slate-600 bg-slate-900"
                  checked={allDay}
                  onChange={(e) => setAllDay(e.target.checked)}
                />
                All day
              </label>
              <div className="relative">
                <select
                  className="neo-input text-[11px] pr-8"
                  value={repeatMode}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === "custom") {
                      openCustom();
                    } else {
                      setRepeatMode(v);
                    }
                  }}
                >
                  <option value="none">Does not repeat</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="custom">Custom…</option>
                </select>
                <p className="mt-1 text-[11px] text-slate-500">
                  {currentRepeatLabel()}
                </p>
              </div>

              {showCustom && (
                <div className="mt-3 rounded-2xl border border-slate-700/80 bg-slate-900/90 p-3 space-y-3">
                  <p className="text-[11px] text-slate-300 mb-1">
                    Custom recurrence
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-[11px]">
                    <span>Repeat every</span>
                    <input
                      type="number"
                      min="1"
                      className="neo-input max-w-[70px]"
                      value={customEvery}
                      onChange={(e) =>
                        setCustomEvery(Number(e.target.value) || 1)
                      }
                    />
                    <select
                      className="neo-input max-w-[110px]"
                      value={customUnit}
                      onChange={(e) => setCustomUnit(e.target.value)}
                    >
                      <option value="day">day</option>
                      <option value="week">week</option>
                      <option value="month">month</option>
                    </select>
                  </div>

                  <div className="space-y-1 text-[11px]">
                    <p className="text-slate-400">Ends</p>
                    <label className="flex items-center gap-2 text-slate-300">
                      <input
                        type="radio"
                        name="customEnd"
                        checked={customEndMode === "never"}
                        onChange={() => setCustomEndMode("never")}
                      />
                      Never (we&apos;ll cap to a safe number)
                    </label>
                    <label className="flex items-center gap-2 text-slate-300">
                      <input
                        type="radio"
                        name="customEnd"
                        checked={customEndMode === "after"}
                        onChange={() => setCustomEndMode("after")}
                      />
                      After
                      <input
                        type="number"
                        min="1"
                        className="neo-input max-w-[70px]"
                        value={customEndCount}
                        onChange={(e) =>
                          setCustomEndCount(Number(e.target.value) || 1)
                        }
                      />
                      occurrences
                    </label>
                  </div>

                  <div className="flex justify-end gap-2 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setShowCustom(false)}
                      className="rounded-full border border-slate-700/80 px-3 py-1 text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (customEndMode === "never") {
                          setRepeatCount(60);
                        } else {
                          setRepeatCount(customEndCount || 8);
                        }
                        applyCustom();
                      }}
                      className="neo-button px-4 py-1 text-[11px]"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 text-xs items-start">
            <div className="mt-1 text-slate-400">📝</div>
            <textarea
              className="neo-input min-h-[70px]"
              placeholder={
                tab === "task"
                  ? "Add a small description or breakdown of what you want to study."
                  : "Add class details, meeting link, or important notes."
              }
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Subject selector backed by MongoDB */}
          <div className="flex gap-3 text-xs items-start">
            <div className="mt-1 text-slate-400">📚</div>
            <div className="flex-1 space-y-2">
              <select
                className="neo-input"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
              >
                <option value="">My Study Timeline</option>
                {subjects.map((subj) => (
                  <option key={subj._id} value={subj._id}>
                    {subj.name}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <input
                  className="neo-input flex-1"
                  placeholder="Add your own subject (stored in your account)"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                />
                <button
                  type="button"
                  onClick={addSubject}
                  className="neo-button px-4 py-2 text-xs"
                  disabled={subjectSaving}
                >
                  {subjectSaving ? "…" : "+"}
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                Subjects are saved to your account in MongoDB, so they follow you
                on any device.
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="neo-button px-6" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CalendarView;