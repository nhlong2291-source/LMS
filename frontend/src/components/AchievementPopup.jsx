import React from "react";

export default function AchievementPopup({
  title = "Achievement unlocked",
  description = "",
  onClose,
}) {
  return (
    <div
      role="dialog"
      style={{
        position: "fixed",
        right: 16,
        bottom: 80,
        maxWidth: 360,
        padding: 12,
        boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
        background: "#fff",
        borderRadius: 8,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <strong>{title}</strong>
          {description && (
            <div style={{ fontSize: 13, color: "#555" }}>{description}</div>
          )}
        </div>
        <div>
          <button onClick={onClose} aria-label="close">
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
