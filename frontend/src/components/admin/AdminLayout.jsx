import React from "react";
import Layout from "../Layout";

export default function AdminLayout({ children, title = "Admin" }) {
  return (
    <Layout>
      <div style={{ display: "flex", minHeight: "80vh" }}>
        <aside
          style={{ width: 240, borderRight: "1px solid #eee", padding: 12 }}
        >
          <h4>{title}</h4>
          <nav>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li>Dashboard</li>
              <li>Courses</li>
              <li>Users</li>
              <li>Reports</li>
            </ul>
          </nav>
        </aside>
        <section style={{ flex: 1, padding: 16 }}>{children}</section>
      </div>
    </Layout>
  );
}
