import React from "react";
import TodoView from "../components/TodoView.jsx";

const TasksPage = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 mb-1">To-Do · Study queue</p>
          <h1 className="text-xl font-semibold text-slate-50">
            Tasks & Focus Queue
          </h1>
        </div>
        <p className="hidden md:block text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500">
          Inbox for your brain
        </p>
      </div>
      <TodoView />
    </div>
  );
};

export default TasksPage;