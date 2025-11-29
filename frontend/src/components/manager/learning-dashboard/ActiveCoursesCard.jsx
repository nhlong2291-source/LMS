import React from "react";

export default function ActiveCoursesCard({ count = 0 }) {
  return (
    <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 6 }}>
      <h5>Active Courses</h5>
      <div style={{ fontSize: 20 }}>{count}</div>
    </div>
  );
}
