import React from "react";

export default function RoleSwitch({ role = "student", onChange }) {
  const toggle = () =>
    onChange && onChange(role === "student" ? "manager" : "student");
  return (
    <div>
      <small>Role: {role}</small>
      <button onClick={toggle} style={{ marginLeft: 8 }}>
        Switch
      </button>
    </div>
  );
}
