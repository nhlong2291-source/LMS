import React from "react";

export default function Breadcrumbs({ items = [] }) {
  if (!items || items.length === 0) return null;
  return (
    <nav aria-label="breadcrumb" style={{ padding: "8px 16px" }}>
      {items.map((it, i) => (
        <span key={i} style={{ marginRight: 8 }}>
          {it.label}
          {i < items.length - 1 ? " / " : ""}
        </span>
      ))}
    </nav>
  );
}
