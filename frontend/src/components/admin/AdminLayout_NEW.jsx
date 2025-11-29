import React from "react";
import Layout from "../Layout";

export default function AdminLayout_NEW({ children }) {
  return (
    <Layout>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "260px 1fr",
          minHeight: "80vh",
        }}
      >
        <nav style={{ padding: 16, borderRight: "1px solid #eee" }}>
          <h4>Admin</h4>
          <div style={{ marginTop: 8 }}>Quick links</div>
        </nav>
        <main style={{ padding: 20 }}>{children}</main>
      </div>
    </Layout>
  );
}
