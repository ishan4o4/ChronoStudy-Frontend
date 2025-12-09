import React from "react";
import { Link } from "react-router-dom";

const neonBlob =
  "bg-[radial-gradient(circle_at_10%_20%,rgba(248,113,113,0.35),transparent_60%),radial-gradient(circle_at_80%_0,rgba(56,189,248,0.3),transparent_55%),radial-gradient(circle_at_50%_100%,rgba(190,242,100,0.25),transparent_55%)]";

const AuthLayout = ({ children, mode }) => {
  return (
    <div className={`min-h-screen flex items-center justify-center bg-slate-950 ${neonBlob}`}>
      <div className="max-w-5xl w-full mx-4 grid gap-12 rounded-[2.5rem] border border-slate-800/60 bg-slate-950/80 p-8 shadow-[0_0_60px_rgba(15,23,42,0.9)] md:grid-cols-[1.2fr_1fr] md:p-10 lg:p-12">
        <div className="flex flex-col justify-between gap-10">
          <header className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-neon-pink via-neon-blue to-neon-lime p-[2px]">
              <div className="h-full w-full rounded-2xl bg-slate-950/80 flex items-center justify-center text-xs font-mono text-slate-100">
                ⏱️
              </div>
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.25em] text-slate-400">
                ChronoStudy
              </p>
              <p className="text-sm text-slate-300">Your Neo Study Operating System</p>
            </div>
          </header>

          <main className="space-y-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
              <span className="bg-gradient-to-r from-neon-pink via-neon-blue to-neon-lime bg-clip-text text-transparent">
                Study in vibes,
              </span>
              <br />
              <span className="text-slate-50">not in chaos.</span>
            </h1>
            <p className="text-sm md:text-base text-slate-300/90 max-w-md">
              Turn your messy timetable into a clean, aesthetic dashboard. Track hours, crush
              deadlines, and keep your streaks alive — all in one Gen Z native workspace.
            </p>
            <div className="flex flex-wrap gap-3 text-xs text-slate-300">
              <span className="neo-pill">Live stats</span>
              <span className="neo-pill">Streaks & vibes</span>
              <span className="neo-pill">Calendar x To-Do</span>
              <span className="neo-pill">For students only</span>
            </div>
          </main>

          <footer className="flex items-center justify-between text-xs text-slate-500">
            <p>Built for Gen Z / Alpha students who live in tabs and playlists.</p>
            <div className="hidden md:flex gap-1 text-[10px] font-mono uppercase tracking-[0.3em] text-slate-500">
              <span className="h-1 w-10 rounded-full bg-gradient-to-r from-neon-pink to-neon-blue" />
              <span>v1.0</span>
            </div>
          </footer>
        </div>

        <div className="neo-card px-6 py-7 md:px-7 md:py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-slate-50">
              {mode === "login" ? "Welcome back, brainiac ✨" : "Create your study OS ⚡"}
            </h2>
            <Link
              to={mode === "login" ? "/signup" : "/login"}
              className="text-xs text-neon-blue hover:underline"
            >
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
