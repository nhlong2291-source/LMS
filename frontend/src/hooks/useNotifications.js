import { useCallback } from "react";
import { useNotifications as useNotificationsCtx } from "../contexts";

// Lightweight convenience wrapper around NotificationContext
export default function useNotifications() {
  const ctx = useNotificationsCtx();
  const {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
  } = ctx;

  const notify = useCallback(
    (message, options = {}) => {
      // options: { type, title, duration, meta }
      const payload = {
        message,
        type: options.type || "info",
        title: options.title,
        duration: options.duration,
        meta: options.meta,
      };
      return addNotification(payload);
    },
    [addNotification]
  );

  return {
    notifications,
    notify,
    removeNotification,
    clearNotifications,
  };
}
