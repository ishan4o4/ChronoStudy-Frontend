import React from "react";
import Dashboard from "../components/Dashboard.jsx";
import CalendarView from "../components/CalendarView.jsx";
import TodoView from "../components/TodoView.jsx";

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Home · Overview</p>
            <h1 className="text-xl md:text-2xl font-semibold text-slate-50">
              Main dashboard
            </h1>
          </div>
          <p className="hidden md:block text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500">
            CHRONOSTUDY
          </p>
        </div>
        <div className="dashboard-top-cards">
            <Dashboard />
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm md:text-base font-semibold text-slate-100">
            Calendar &amp; Today&apos;s Queue
          </h2>
          <p className="text-[11px] text-slate-500">
            Plan your blocks and act on tasks from one place.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr),minmax(0,1fr)]">
          <div className="neo-card p-3 md:p-4 flex flex-col calendar-box">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400">Schedule</p>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">
                Calendar
              </p>
            </div>
            <div className="mt-1">
              <CalendarView showEditor={false} />
            </div>
          </div>

          <div className="flex flex-col space-y-2 today-queue-box">
            <div className="flex items-center justify-between px-1">
              <p className="text-xs text-slate-400">Today&apos;s tasks</p>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">
                Focus queue
              </p>
            </div>
            <TodoView variant="today" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;