import React from "react";

export default function QuickActionsBar({ actions = [] }) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {actions.length === 0 ? (
        <button>Assign Course</button>
      ) : (
        actions.map((a, i) => (
          <button key={i} onClick={a.onClick}>
            {a.label}
          </button>
        ))
      )}
    </div>
  );
}
