import React, { useState } from "react";

export default function Register({ onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (onRegister) onRegister({ email, password });
  };

  return (
    <div style={{ maxWidth: 520, margin: 40, padding: 20 }}>
      <h3>Create an account</h3>
      <form onSubmit={submit}>
        <div style={{ marginBottom: 8 }}>
          <label>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
