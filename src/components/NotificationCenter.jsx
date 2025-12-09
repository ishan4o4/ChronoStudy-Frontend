import React from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../state/NotificationContext.jsx";

const NotificationCenter = () => {
  const { current, snooze, dismiss } = useNotifications();
  const navigate = useNavigate();

  if (!current || !current.task) return null;

  const { task, priority } = current;

  const priorityLabel =
    priority === "high"
      ? "High priority"
      : priority === "medium"
      ? "Medium priority"
      : "Low priority";

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-xs">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/95 px-4 py-3 shadow-xl shadow-black/60 text-xs text-slate-100">
        <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500 mb-1">
          Reminder
        </p>
        <p className="text-sm font-semibold text-slate-50">
          {task.title || "Pending task"}
        </p>
        {task.subject && (
          <p className="mt-0.5 text-[11px] text-slate-400">{task.subject}</p>
        )}
        <p className="mt-1 text-[10px] text-slate-500">
          {priorityLabel} • from your task list
        </p>

        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            className="neo-button px-3 py-1 text-[11px]"
            onClick={() => {
              dismiss();
              navigate("/tasks");
            }}
          >
            View tasks
          </button>
          <button
            type="button"
            className="rounded-full border border-slate-700 px-3 py-1 text-[11px] text-slate-300 hover:border-slate-500 hover:bg-slate-900 transition"
            onClick={() => snooze()}
          >
            Snooze
          </button>
          <button
            type="button"
            className="ml-auto text-[11px] text-slate-500 hover:text-slate-300"
            onClick={dismiss}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;