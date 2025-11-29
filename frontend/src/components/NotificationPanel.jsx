import React from "react";

export default function NotificationPanel({ notifications = [] }) {
  return (
    <div style={{ minWidth: 320, maxWidth: 420 }}>
      <h4>Notifications</h4>
      {notifications.length === 0 ? (
        <div>No notifications</div>
      ) : (
        <ul>
          {notifications.map((n, idx) => (
            <li
              key={idx}
              style={{ padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}
            >
              {n.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
