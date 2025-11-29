import React from "react";
import Layout from "../Layout";

export default function ManagerLayout({ children, title = "Manager" }) {
  return (
    <Layout>
      <div style={{ display: "flex", minHeight: "80vh" }}>
        <aside
          style={{ width: 220, borderRight: "1px solid #eee", padding: 12 }}
        >
          <h4>{title}</h4>
          <nav>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li>Overview</li>
              <li>Team</li>
              <li>Courses</li>
              <li>Reports</li>
            </ul>
          </nav>
        </aside>
        <section style={{ flex: 1, padding: 16 }}>{children}</section>
      </div>
    </Layout>
  );
}
