import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

const TopBar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const email = user?.email || "";
  const username = user?.username || "";
  const initial =
    (username && username[0]?.toUpperCase()) ||
    (email && email[0]?.toUpperCase()) ||
    "I";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      window.addEventListener("mousedown", handleClick);
    }
    return () => window.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSettings = () => {
    setMenuOpen(false);
    if (location.pathname !== "/settings") {
      navigate("/settings");
    }
  };

  const pageLabel =
    location.pathname === "/"
      ? "Dashboard overview"
      : location.pathname === "/tasks"
      ? "Tasks • today’s queue"
      : location.pathname === "/calendar"
      ? "Calendar • study blocks"
      : location.pathname === "/stats"
      ? "Stats • streaks & charts"
      : location.pathname === "/settings"
      ? "Settings • account & theme"
      : "ChronoStudy";

  return (
    <header className="flex items-center justify-between border-b border-slate-800/70 bg-slate-950/90 px-4 py-3 md:px-6">
      {/* Left: sidebar toggle (mobile) + live indicator */}
      <div className="flex items-center gap-3">
        {/* Hamburger for mobile */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-700/80 bg-slate-900/80 text-slate-200 hover:border-neon-blue/70 md:hidden"
          aria-label="Toggle navigation"
        >
          <span className="block h-[2px] w-4 bg-slate-200 mb-[3px]" />
          <span className="block h-[2px] w-4 bg-slate-200 mb-[3px]" />
          <span className="block h-[2px] w-4 bg-slate-200" />
        </button>

        <div className="h-1.5 w-10 rounded-full bg-gradient-to-r from-lime-400 via-emerald-400 to-neon-blue animate-pulse" />
        <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-slate-400">
          Live · Focus mode ready
        </p>
      </div>

      {/* Center: page label (hidden on small screens) */}
      <div className="hidden md:block">
        <p className="text-xs text-slate-500">{pageLabel}</p>
      </div>

      {/* Right: avatar + menu */}
      <div className="flex items-center gap-3 relative" ref={menuRef}>
          {/* === TUTORIAL TARGET WRAPPER === */}
          <div className="profile-icon-wrapper"> 
              {/* Avatar button */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500 text-sm font-semibold text-slate-950 shadow-[0_0_0_1px_rgba(15,23,42,0.9),0_12px_30px_rgba(6,182,212,0.45)] hover:brightness-110 transition"
            >
              {initial}
            </button>
          </div>
          {/* ============================== */}

        {/* Dropdown panel */}
        {menuOpen && (
          <div className="absolute right-0 top-11 z-40 w-60">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/95 px-4 py-3 shadow-xl shadow-black/70 backdrop-blur">
              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
                Signed in as
              </p>
              <p className="mt-0.5 text-xs font-medium text-slate-100 truncate">
                {email || "me@ishan.vip"}
              </p>

              <div className="mt-3 h-px w-full bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

              <div className="mt-3 space-y-1">
                <button
                  type="button"
                  onClick={handleSettings}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs text-slate-200 hover:bg-slate-900/90"
                >
                  <span>Settings</span>
                  <span className="text-[10px] text-slate-500">
                    Theme · Password
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs text-red-300 hover:bg-red-500/10"
                >
                  <span>Logout</span>
                  <span className="text-[10px] text-red-400">⌘⇧Q</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;