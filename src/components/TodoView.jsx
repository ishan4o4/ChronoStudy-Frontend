import React, { useEffect, useState } from "react";
import { api } from "../utils/api.js";
import { useNotifications } from "../state/NotificationContext.jsx";

const emptyTask = {
  title: "",
  subject: "",
  priority: "medium",
  estimatedMinutes: 0
};

const priorityColors = {
  low: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  medium: "bg-amber-500/15 text-amber-300 border-amber-500/40",
  high: "bg-red-500/15 text-red-300 border-red-500/50"
};

const TodoView = ({ variant = "full" }) => {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(emptyTask);
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());

  const { settings: notificationSettings } = useNotifications();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000); 

    return () => clearInterval(interval);
  }, []);

  const showPrevious = variant === "full";

  const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const getNotificationInterval = (task) => {
    if (!notificationSettings) return null;

    const settings = task.notificationSettings || notificationSettings;
    const priority = task.priority || "medium";

    switch (priority) {
      case "high":
        return settings.highEvery;
      case "medium":
        return settings.mediumEvery;
      case "low":
        return settings.lowEvery;
      default:
        return settings.mediumEvery;
    }
  };

  const getTimeUntilNextNotification = (task) => {
    if (!notificationSettings?.enabled) return null;
    if (task.completed || task.status === "completed") return null;

    const notifInterval = getNotificationInterval(task);
    if (!notifInterval) return null;

    const lastTime = task.lastNotified
      ? new Date(task.lastNotified).getTime()
      : new Date(task.createdAt).getTime();

    const intervalMs = notifInterval * 60 * 1000;
    const nextNotificationTime = lastTime + intervalMs;
    const timeRemaining = nextNotificationTime - currentTime;

    if (timeRemaining <= 0) {
      return { minutes: 0, text: "Notifying now", overdue: true };
    }

    const minutesRemaining = Math.ceil(timeRemaining / 60000);

    if (minutesRemaining < 1) {
      return { minutes: 0, text: "< 1m", overdue: false };
    } else if (minutesRemaining < 60) {
      return {
        minutes: minutesRemaining,
        text: `${minutesRemaining}m`,
        overdue: false
      };
    } else {
      const hours = Math.floor(minutesRemaining / 60);
      const mins = minutesRemaining % 60;
      return {
        minutes: minutesRemaining,
        text: mins > 0 ? `${hours}h ${mins}m` : `${hours}h`,
        overdue: false
      };
    }
  };

  const getTrackedMinutes = (task) => {
    if (!task) return 0;

    const baseMs = task.totalTrackedMs || 0;
    const runningMs = task.timerStart
      ? currentTime - new Date(task.timerStart).getTime()
      : 0;

    const totalMs = baseMs + Math.max(0, runningMs);
    return Math.floor(totalMs / 60000);
  };

  const loadTasks = async () => {
    try {
      setLoadingList(true);
      const res = await api.get("/tasks");
      setTasks(res.data || []);
    } catch (error) {
      console.error("Load tasks error", error);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === "estimatedMinutes" ? Number(value) || 0 : value
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      const taskPayload = {
        title: form.title.trim(),
        subject: form.subject.trim(),
        priority: form.priority,
        estimatedMinutes: form.estimatedMinutes || 0
      };

      if (notificationSettings) {
        taskPayload.notificationSettings = {
          enabled: notificationSettings.enabled,
          highEvery: notificationSettings.highEvery,
          mediumEvery: notificationSettings.mediumEvery,
          lowEvery: notificationSettings.lowEvery,
          defaultSnooze: notificationSettings.defaultSnooze
        };
      }

      await api.post("/tasks", taskPayload);
      setForm(emptyTask);
      await loadTasks();
    } catch (error) {
      console.error("Create task error", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async (task) => {
    try {
      const nextCompleted = !task.completed;
      await api.put(`/tasks/${task._id}`, {
        completed: nextCompleted,
        status: nextCompleted ? "completed" : "pending"
      });
      await loadTasks();
    } catch (error) {
      console.error("Toggle complete error", error);
    }
  };

  const deleteTask = async (task) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/${task._id}`);
      await loadTasks();
    } catch (error) {
      console.error("Delete task error", error);
    }
  };

  const editTask = async (task) => {
    const newTitle = window.prompt("Edit task title:", task.title);
    if (newTitle === null) return;

    const newMinutesStr = window.prompt(
      "Edit estimated minutes (optional):",
      (task.estimatedMinutes ?? 0).toString()
    );
    const newMinutes = Number(newMinutesStr);
    const safeMinutes =
      Number.isFinite(newMinutes) && newMinutes > 0
        ? newMinutes
        : task.estimatedMinutes || 0;

    try {
      await api.put(`/tasks/${task._id}`, {
        title: newTitle.trim(),
        estimatedMinutes: safeMinutes
      });
      await loadTasks();
    } catch (error) {
      console.error("Edit task error", error);
    }
  };

  const changePriority = async (task, priority) => {
    try {
      await api.put(`/tasks/${task._id}`, { priority });
      await loadTasks();
    } catch (error) {
      console.error("Change priority error", error);
    }
  };

  const startTimer = async (task) => {
    try {
      await api.post(`/tasks/${task._id}/start-timer`);
      await loadTasks();
    } catch (error) {
      console.error("Start timer error", error);
    }
  };

  const stopTimer = async (task) => {
    try {
      await api.post(`/tasks/${task._id}/stop-timer`);
      await loadTasks();
    } catch (error) {
      console.error("Stop timer error", error);
    }
  };

  const endTask = async (task) => {
    try {
      await api.put(`/tasks/${task._id}`, {
        completed: true,
        status: "completed"
      });
      await loadTasks();
    } catch (error) {
      console.error("End task error", error);
    }
  };

  const nowDate = new Date(currentTime);

  const todayTasks = tasks.filter((task) => {
    if (!task.createdAt) return false;
    const created = new Date(task.createdAt);
    return isSameDay(created, nowDate);
  });

  const previousTasks = tasks.filter((task) => {
    if (!task.createdAt) return true;
    const created = new Date(task.createdAt);
    return !isSameDay(created, nowDate);
  });

  const renderTaskList = (list) => {
    return (
      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {list.map((task) => {
          const isDone =
            task.completed === true || task.status === "completed";

          const nextNotif = getTimeUntilNextNotification(task);
          const notifEnabled = notificationSettings?.enabled !== false;

          const trackedMinutes = getTrackedMinutes(task);
          const isTimerRunning = !!task.timerStart;

          return (
            <div
              key={task._id}
              className={`w-full rounded-2xl border px-3 py-2 text-xs flex items-center justify-between gap-3 transition ${isDone
                  ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-100"
                  : "border-slate-700/80 bg-slate-900/70 text-slate-200 hover:border-neon-blue/70"
                }`}
            >
              <div className="flex items-center gap-2 flex-1">
                <button
                  type="button"
                  onClick={() => toggleComplete(task)}
                  className={`h-4 w-4 rounded border flex items-center justify-center text-[9px] ${isDone
                      ? "border-emerald-400 bg-emerald-500/80 text-slate-950"
                      : "border-slate-500 bg-slate-900 text-slate-400"
                    }`}
                  title="Toggle complete"
                >
                  {isDone ? "✓" : ""}
                </button>
                <div className="flex-1">
                  <p
                    className={`font-medium text-[11px] ${isDone ? "line-through" : ""
                      }`}
                  >
                    {task.title}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {task.subject || "No subject"}
                    {trackedMinutes > 0 && (
                      <span className="ml-1">
                        · ⏱ {trackedMinutes}m tracked
                        {isTimerRunning && " (running)"}
                      </span>
                    )}
                    {!isDone && notifEnabled && nextNotif && (
                      <span
                        className={`ml-1 ${nextNotif.overdue ? "text-red-400" : ""
                          }`}
                      >
                        · 🔔 in {nextNotif.text}
                      </span>
                    )}
                    {!isDone && !notifEnabled && (
                      <span className="ml-1 text-slate-500">· 🔕 off</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!isDone && (
                  <>
                    {isTimerRunning ? (
                      <button
                        type="button"
                        onClick={() => stopTimer(task)}
                        className="rounded-full border border-amber-500/70 px-2 py-1 text-[10px] text-amber-200 hover:bg-amber-500/20"
                        title="Stop / pause timer"
                      >
                        Stop
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => startTimer(task)}
                        className="rounded-full border border-emerald-500/70 px-2 py-1 text-[10px] text-emerald-200 hover:bg-emerald-500/20"
                        title="Start timer"
                      >
                        Start
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => endTask(task)}
                      className="hidden md:inline-flex rounded-full border border-sky-500/70 px-2 py-1 text-[10px] text-sky-200 hover:bg-sky-500/20"
                      title="End task (complete)"
                    >
                      End
                    </button>
                  </>
                )}

                <select
                  value={task.priority || "medium"}
                  onChange={(e) => changePriority(task, e.target.value)}
                  className={`hidden md:inline-flex rounded-full border px-2 py-0.5 text-[10px] ${priorityColors[task.priority || "medium"]
                    }`}
                  title="Change priority"
                >
                  <option value="low">Low</option>
                  <option value="medium">Med</option>
                  <option value="high">High</option>
                </select>
                <button
                  type="button"
                  onClick={() => editTask(task)}
                  className="hidden md:inline-flex rounded-full border border-slate-600/80 px-2 py-1 text-[10px] text-slate-200 hover:border-neon-blue/70"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => deleteTask(task)}
                  className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-red-500/70 text-[11px] text-red-300 hover:bg-red-500/20"
                  title="Delete task"
                >
                  ×
                </button>
              </div>
            </div>
          );
        })}

        {!loadingList && list.length === 0 && (
          <p className="text-xs text-slate-500">No tasks here yet.</p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <form
        onSubmit={onSubmit}
        className="neo-card p-4 flex flex-col md:flex-row gap-3 items-start md:items-center"
      >
        <div className="flex-1 w-full flex flex-col md:flex-row gap-3">
          <input
            name="title"
            className="neo-input"
            placeholder="New task — e.g. Finish physics numericals"
            value={form.title}
            onChange={onChange}
          />
          <input
            name="subject"
            className="neo-input md:max-w-[140px]"
            placeholder="Subject"
            value={form.subject}
            onChange={onChange}
          />
          <select
            name="priority"
            className="neo-input md:max-w-[120px]"
            value={form.priority}
            onChange={onChange}
          >
            <option value="low">Low 🔵</option>
            <option value="medium">Medium 🟡</option>
            <option value="high">High 🔴</option>
          </select>
        </div>
        <button className="neo-button w-full md:w-auto" disabled={loading}>
          {loading ? "Adding..." : "Add to queue"}
        </button>
      </form>

      {/* Section 1*/}
      <div className="neo-card p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-slate-400">Today&apos;s queue</p>
          <p className="text-[11px] font-mono text-slate-500 uppercase tracking-[0.2em]">
            {loadingList ? "Loading..." : `${todayTasks.length} TASKS`}
          </p>
        </div>
        {renderTaskList(todayTasks)}
      </div>

      {/* Section 2*/}
      {showPrevious && (
        <div className="neo-card p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-slate-400">Previous tasks</p>
            <p className="text-[11px] font-mono text-slate-500 uppercase tracking-[0.2em]">
              {loadingList ? "Loading..." : `${previousTasks.length} tasks`}
            </p>
          </div>
          {renderTaskList(previousTasks)}
        </div>
      )}
    </div>
  );
};

export default TodoView;