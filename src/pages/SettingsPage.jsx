import React, { useEffect, useState } from "react";
import { api } from "../utils/api.js";
import { useAuth } from "../state/AuthContext.jsx";
import { useNotifications } from "../state/NotificationContext.jsx";

const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const {
    settings,
    loading: notifLoading,
    updateSettings,
    reload,
    defaultSettings
  } = useNotifications();

  // ----- Password -----
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: ""
  });
  const [savingPassword, setSavingPassword] = useState(false);

  // ----- Theme -----
  const [theme, setTheme] = useState(user?.vibe || "neo-neon");
  const [savingTheme, setSavingTheme] = useState(false);

  // ----- Notifications -----
  const [notifForm, setNotifForm] = useState({}); 
  const [savingNotif, setSavingNotif] = useState(false);

  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (user?.vibe) {
      setTheme(user.vibe);
    }
  }, [user?.vibe]);

  useEffect(() => {
    if (!settings) return; 

    setNotifForm({
      enabled: settings.enabled ?? defaultSettings.enabled,
      highEvery: settings.highEvery ?? defaultSettings.highEvery,
      mediumEvery: settings.mediumEvery ?? defaultSettings.mediumEvery,
      lowEvery: settings.lowEvery ?? defaultSettings.lowEvery,
      defaultSnooze:
        settings.defaultSnooze ?? defaultSettings.defaultSnooze
    });
  }, [settings]); 

  /* ============================
      Password
  ============================ */
  const onPasswordChange = (e) => {
    setPasswordForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    setSavingPassword(true);
    setStatus(null);
    try {
      const res = await api.post("/auth/change-password", passwordForm);
      setStatus({
        type: "success",
        message: res.data.message || "Password updated."
      });
      setPasswordForm({ oldPassword: "", newPassword: "" });
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Could not update password. Try again.";
      setStatus({ type: "error", message });
    } finally {
      setSavingPassword(false);
    }
  };

  /* ============================
      Theme
  ============================ */
  const submitTheme = async (e) => {
    e.preventDefault();
    setSavingTheme(true);
    setStatus(null);
    try {
      const res = await api.post("/auth/update-theme", { vibe: theme });
      if (res.data?.user) {
        updateUser(res.data.user);
      } else {
        updateUser({ ...user, vibe: theme });
      }
      setStatus({
        type: "success",
        message: "Theme updated for your account."
      });
    } catch (error) {
      const message =
        error?.response?.data?.message || "Could not update theme. Try again.";
      setStatus({ type: "error", message });
    } finally {
      setSavingTheme(false);
    }
  };

  /* ============================
      Notifications
  ============================ */
  const handleNotifChange = (e) => {
    const { name, type, checked, value } = e.target;
    setNotifForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : Math.max(1, Number(value) || 1)
    }));
  };

  const submitNotif = async (e) => {
    e.preventDefault();
    setSavingNotif(true);
    setStatus(null);
    try {
      const payload = {
        enabled: !!notifForm.enabled,
        highEvery: Number(notifForm.highEvery),
        mediumEvery: Number(notifForm.mediumEvery),
        lowEvery: Number(notifForm.lowEvery),
        defaultSnooze: Number(notifForm.defaultSnooze)
      };

      await updateSettings(payload);

      await reload();

      setStatus({
        type: "success",
        message: "Notification settings saved."
      });
    } catch (err) {
      console.error("Failed to save notification settings", err);
      setStatus({
        type: "error",
        message: "Could not save notification settings."
      });
    } finally {
      setSavingNotif(false);
    }
  };

  const isFormReady = !notifLoading && settings && Object.keys(notifForm).length > 0;


  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">Account · Settings</p>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-50">
            Settings
          </h1>
        </div>
        {user && (
          <p className="text-[11px] text-slate-400">
            Signed in as{" "}
            <span className="text-slate-100">{user.username}</span>
          </p>
        )}
      </header>
      
      <section className="grid gap-4 md:grid-cols-2">
        <div className="neo-card p-4 md:p-6">
          <h2 className="text-sm md:text-base font-semibold text-slate-100 mb-1">
            Change password
          </h2>
          <p className="text-[11px] text-slate-400 mb-4">
            Update your password using your current one. This keeps your study
            OS locked to you. Only works if you have custom email/password provided by an institution.
          </p>
          <form className="space-y-3" onSubmit={submitPassword}>
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Current password
              </label>
              <input
                type="password"
                name="oldPassword"
                className="neo-input w-full"
                placeholder="••••••••"
                value={passwordForm.oldPassword}
                onChange={onPasswordChange}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                New password
              </label>
              <input
                type="password"
                name="newPassword"
                className="neo-input w-full"
                placeholder="At least 6 characters"
                value={passwordForm.newPassword}
                onChange={onPasswordChange}
              />
            </div>
            <div className="flex justify-end pt-2">
              <button className="neo-button px-5" disabled={savingPassword}>
                {savingPassword ? "Saving..." : "Update password"}
              </button>
            </div>
          </form>
        </div>

        {/* Theme */}
        <div className="neo-card p-4 md:p-6">
          <h2 className="text-sm md:text-base font-semibold text-slate-100 mb-1">
            Theme &amp; vibe
          </h2>
          <p className="text-[11px] text-slate-400 mb-4">
            Pick the vibe for your ChronoStudy workspace. Background and top bar
            glow adapt to this choice (Disabled).
          </p>
          <form className="space-y-3" onSubmit={submitTheme}>
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Theme
              </label>
              <select
                className="neo-input w-full"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              >
                <option value="neo-neon">Neo-Neon</option>
                <option value="pastel-dream">Pastel Dream</option>
                <option value="terminal-core">Terminal Core</option>
              </select>
            </div>
            <div className="flex justify-end pt-2">
              <button className="neo-button px-5" disabled={savingTheme}>
                {savingTheme ? "Saving..." : "Update theme"}
              </button>
            </div>
          </form>
        </div>
      </section>


      {/* Notifications section */}
      <section className="neo-card p-4 md:p-6">
        <h2 className="text-sm md:text-base font-semibold text-slate-100 mb-1">
          Notifications
        </h2>
        <p className="text-[11px] text-slate-400 mb-4">
          Control how often ChronoStudy reminds you about pending tasks and how
          long snoozes last.
        </p>

        {/* Conditional Rendering based on isFormReady */}
        {!isFormReady ? (
          <p className="text-[11px] text-slate-500">
            Loading notification settings from DB…
          </p>
        ) : (
          <form
            className="grid gap-4 md:grid-cols-2 text-[11px] text-slate-300"
            onSubmit={submitNotif}
          >
            <div className="space-y-3">
              <label className="inline-flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  name="enabled"
                  checked={!!notifForm.enabled}
                  onChange={handleNotifChange}
                  className="h-3 w-3 rounded border-slate-600 bg-slate-900"
                />
                Enable task reminders
              </label>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  High priority reminder every (minutes)
                </label>
                <input
                  type="number"
                  name="highEvery"
                  min="1"
                  className="neo-input w-32"
                  value={notifForm.highEvery}
                  onChange={handleNotifChange}
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Medium priority reminder every (minutes)
                </label>
                <input
                  type="number"
                  name="mediumEvery"
                  min="1"
                  className="neo-input w-32"
                  value={notifForm.mediumEvery}
                  onChange={handleNotifChange}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Low priority reminder every (minutes)
                </label>
                <input
                  type="number"
                  name="lowEvery"
                  min="1"
                  className="neo-input w-32"
                  value={notifForm.lowEvery}
                  onChange={handleNotifChange}
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Default snooze time (minutes)
                </label>
                <input
                  type="number"
                  name="defaultSnooze"
                  min="1"
                  className="neo-input w-32"
                  value={notifForm.defaultSnooze}
                  onChange={handleNotifChange}
                />
                <p className="mt-1 text-[10px] text-slate-500">
                  Used when you press the Snooze button on a reminder.
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <button className="neo-button px-5" disabled={savingNotif}>
                  {savingNotif ? "Saving..." : "Save notification settings"}
                </button>
              </div>
            </div>
          </form>
        )}
      </section>

      {status && (
        <p
          className={`text-[11px] ${
            status.type === "success"
              ? "text-emerald-400"
              : "text-red-400"
          }`}
        >
          {status.message}
        </p>
      )}
    </div>
  );
};

export default SettingsPage;