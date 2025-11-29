import React, { useState } from "react";

export default function ActivationCode({ onActivate }) {
  const [code, setCode] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (onActivate) onActivate(code);
  };

  return (
    <div style={{ maxWidth: 420, margin: 40, padding: 16 }}>
      <h3>Activation</h3>
      <form onSubmit={submit}>
        <div style={{ marginBottom: 8 }}>
          <label>Activation code</label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <button type="submit">Activate</button>
      </form>
    </div>
  );
}
