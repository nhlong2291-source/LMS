import React, { useState } from "react";

export default function GlobalSearch({ onSearch }) {
  const [q, setQ] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(q);
  };

  return (
    <form
      onSubmit={submit}
      style={{ display: "flex", gap: 8, alignItems: "center" }}
    >
      <input
        placeholder="Search courses, lessons..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{ padding: 8 }}
      />
      <button type="submit">Search</button>
    </form>
  );
}
