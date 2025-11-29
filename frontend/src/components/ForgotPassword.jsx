import React, { useState } from "react";

export default function ForgotPassword({ onRequestReset }) {
  const [email, setEmail] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (onRequestReset) onRequestReset(email);
  };

  return (
    <div style={{ maxWidth: 520, margin: 40, padding: 20 }}>
      <h3>Forgot password</h3>
      <form onSubmit={submit}>
        <div style={{ marginBottom: 8 }}>
          <label>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <button type="submit">Send reset link</button>
      </form>
    </div>
  );
}
