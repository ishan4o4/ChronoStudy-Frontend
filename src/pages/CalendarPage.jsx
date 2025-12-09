import React from "react";
import CalendarView from "../components/CalendarView.jsx";

const CalendarPage = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 mb-1">Timeline · Schedule</p>
          <h1 className="text-xl font-semibold text-slate-50">Calendar & Study Blocks</h1>
        </div>
        <p className="hidden md:block text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500">
          Plan the day
        </p>
      </div>
      <CalendarView />
    </div>
  );
};

export default CalendarPage;
