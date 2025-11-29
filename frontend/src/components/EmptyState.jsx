import React from "react";

export default function EmptyState({
  title = "Nothing here",
  message = "",
  action,
}) {
  return (
    <div style={{ textAlign: "center", padding: 24 }}>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {action && <div style={{ marginTop: 12 }}>{action}</div>}
    </div>
  );
}
