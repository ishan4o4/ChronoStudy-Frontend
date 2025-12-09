import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../utils/api";
import { useAuth } from "./AuthContext.jsx";

const NotificationContext = createContext();
export const useNotifications = () => useContext(NotificationContext);

// Backend defaults (for fallback only)
const defaultSettings = {
  enabled: true,
  highEvery: 15,
  mediumEvery: 30,
  lowEvery: 45,
  defaultSnooze: 20,
};

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();

  // SETTINGS
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // CURRENT NOTIFICATION (popup)
  const [current, setCurrent] = useState(null);

  // -------------------------------------------------
  //               LOAD USER SETTINGS
  // -------------------------------------------------
  const loadSettings = async () => {
    if (!user) {
      setSettings(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await api.get("/auth/notification-settings");
      setSettings(res.data || defaultSettings);
    } catch (err) {
      console.error("Notification settings load error", err);
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings) => {
    if (!user) return;
    try {
      const res = await api.post("/auth/notification-settings", newSettings);
      setSettings(res.data || newSettings);
      return res.data;
    } catch (err) {
      console.error("Notification settings save error", err);
      throw err;
    }
  };

  useEffect(() => {
    if (user) loadSettings();
    else {
      setSettings(null);
      setCurrent(null);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // -------------------------------------------------
  //        HANDLE BROWSER NOTIFICATION PERMISSIONS
  // -------------------------------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) return;

    if (Notification.permission === "default") {
      Notification.requestPermission().catch((err) =>
        console.error("Notification permission error", err)
      );
    }
  }, []);

  const showBrowserNotification = (title, body) => {
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    try {
      new Notification(title, {
        body: body || "You have a pending task",
        icon: "/icon-192.png",
      });
    } catch (err) {
      console.error("Failed to show browser notification", err);
    }
  };

  // -------------------------------------------------
  //         FETCH UPCOMING (DUE) NOTIFICATIONS
  // -------------------------------------------------
  const fetchUpcoming = async () => {
    if (!user) return;

    try {
      const res = await api.get("/notifications/upcoming");
      const list = res.data || [];
      const now = Date.now();

      const due = list.find((n) => {
        const byMinutes =
          typeof n.minutesUntilNext === "number" && n.minutesUntilNext <= 0;

        const byTime =
          n.nextNotificationTime &&
          new Date(n.nextNotificationTime).getTime() <= now;

        return byMinutes || byTime;
      });

      if (due) {
        const nextCurrent = {
          task: {
            _id: due.taskId,
            title: due.title,
            subject: due.subject,
          },
          priority: due.priority,
        };

        // Only trigger if it's a NEW notification
        if (!current || current.task._id !== nextCurrent.task._id) {
          setCurrent(nextCurrent);
          showBrowserNotification(due.title, due.subject);
        }
      }
    } catch (err) {
      console.error("Error fetching upcoming notifications", err);
    }
  };

  // -------------------------------------------------
  //    POLL EVERY 1 SECOND + CHECK ON TAB FOCUS
  // -------------------------------------------------
  useEffect(() => {
    if (!user) return;

    // initial check
    fetchUpcoming();

    const id = setInterval(fetchUpcoming, 1000); // every 1 sec

    const onFocus = () => fetchUpcoming();
    window.addEventListener("visibilitychange", onFocus);
    window.addEventListener("focus", onFocus);

    return () => {
      clearInterval(id);
      window.removeEventListener("visibilitychange", onFocus);
      window.removeEventListener("focus", onFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, current]);

  // -------------------------------------------------
  //                   ACTIONS
  // -------------------------------------------------
  const dismiss = async () => {
    if (!current || !current.task?._id) {
      setCurrent(null);
      return;
    }
    try {
      await api.post(`/notifications/dismiss/${current.task._id}`);
    } catch (err) {
      console.error("Error dismissing notification", err);
    } finally {
      setCurrent(null);
    }
  };

  const snooze = async (minutes) => {
    if (!current || !current.task?._id) {
      setCurrent(null);
      return;
    }
    try {
      await api.post(`/notifications/snooze/${current.task._id}`, {
        minutes,
      });
    } catch (err) {
      console.error("Error snoozing notification", err);
    } finally {
      setCurrent(null);
    }
  };

  // -------------------------------------------------
  //                   PROVIDER
  // -------------------------------------------------
  return (
    <NotificationContext.Provider
      value={{
        settings,
        loading,
        updateSettings,
        reload: loadSettings,
        defaultSettings,
        current,
        snooze,
        dismiss,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};