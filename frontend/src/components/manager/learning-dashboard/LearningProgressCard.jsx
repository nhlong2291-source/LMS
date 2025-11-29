import React from "react";

export default function LearningProgressCard({
  title = "Progress",
  value = "0%",
}) {
  return (
    <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 6 }}>
      <h5>{title}</h5>
      <div style={{ fontSize: 20 }}>{value}</div>
    </div>
  );
}
