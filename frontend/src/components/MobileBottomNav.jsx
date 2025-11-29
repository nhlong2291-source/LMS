import React from "react";

export default function MobileBottomNav({ items = [] }) {
  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        borderTop: "1px solid #eee",
        background: "#fff",
        display: "flex",
        justifyContent: "space-around",
        padding: 8,
      }}
    >
      {items.length === 0 ? (
        <div>Home • Courses • Profile</div>
      ) : (
        items.map((it, i) => (
          <button key={i} onClick={it.onClick}>
            {it.label}
          </button>
        ))
      )}
    </nav>
  );
}
