import React from "react";

export default function Layout({ children }) {
  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <header style={{ padding: "12px 20px", borderBottom: "1px solid #eee" }}>
        <strong>LMS</strong>
      </header>
      <main style={{ flex: 1 }}>{children}</main>
      <footer
        style={{
          padding: 12,
          borderTop: "1px solid #eee",
          textAlign: "center",
        }}
      >
        © {new Date().getFullYear()} LMS
      </footer>
    </div>
  );
}
