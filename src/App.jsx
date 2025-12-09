import React, { useState } from "react";
import { Navigate, NavLink, Outlet, Route, Routes } from "react-router-dom";
import { useAuth } from "./state/AuthContext.jsx";
import { NotificationProvider } from "./state/NotificationContext.jsx";
import TopBar from "./components/TopBar.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import TasksPage from "./pages/TasksPage.jsx";
import CalendarPage from "./pages/CalendarPage.jsx";
import StatsPage from "./pages/StatsPage.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import NotificationCenter from "./components/NotificationCenter.jsx";
import LandingPage from "./pages/LandingPage.jsx";

// ⭐ NEW: onboarding tutorial overlay
import OnboardingOverlay from "./components/OnboardingOverlay.jsx";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/tasks", label: "Tasks" },
  { to: "/calendar", label: "Calendar" },
  { to: "/stats", label: "Stats" }
];

const AppShell = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="flex h-screen flex-col bg-slate-950 text-slate-100">
      {/* Top bar with mobile menu toggle */}
      {/* === ADDED CLASS: app-topbar === */}
      <div className="app-topbar">
          <TopBar onToggleSidebar={toggleSidebar} />
      </div>

      <main className="flex flex-1 overflow-hidden">
        {/* MOBILE overlay when sidebar is open */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/50 md:hidden"
            onClick={closeSidebar}
          />
        )}

        {/* SIDEBAR */}
        {/* === ADDED CLASS: app-sidebar === */}
        <aside
          className={[
            "fixed inset-y-0 left-0 z-30 w-56 border-r border-slate-800/80 bg-slate-950/95 p-4",
            "transform transition-transform duration-200 ease-out",
            "md:static md:translate-x-0 md:bg-slate-950/80",
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
             // Add the custom class here to ensure it's always present:
             "app-sidebar"
          ].join(" ")}
        >
          <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.25em] text-slate-500">
            Navigation
          </p>

          <nav className="space-y-2 text-xs text-slate-300">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/dashboard"}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  [
                    "block rounded-2xl px-3 py-2 border transition",
                    isActive
                      ? "bg-slate-900/90 border-blue-400/70 text-slate-50"
                      : "bg-slate-900/40 border-slate-800/80 hover:border-blue-400/60 hover:bg-slate-900/70"
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <section className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </section>
      </main>

      {/* Global notifications */}
      <NotificationCenter />

      {/* ⭐ Onboarding tutorial for first-time users */}
      <OnboardingOverlay />
    </div>
  );
};

const AppRoutes = () => {
  const { user } = useAuth();

  // 🟦 Not logged in → Landing + Login
  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // 🟩 Logged in → main app
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* Redirect root → dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

const App = () => {
  return (
    <NotificationProvider>
      <AppRoutes />
    </NotificationProvider>
  );
};

export default App;