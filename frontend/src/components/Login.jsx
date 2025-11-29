import React, { useState } from "react";

export default function Login({ onSubmit }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit({ username, password });
  };

  return (
    <div
      style={{
        maxWidth: 420,
        margin: "40px auto",
        padding: 20,
        border: "1px solid #eee",
        borderRadius: 6,
      }}
    >
      <h3>Sign in</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 10 }}>
          <label>Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <button type="submit" style={{ padding: "8px 12px" }}>
          Login
        </button>
      </form>
    </div>
  );
}
