import React from "react";

export default function LoadingState({ message = "Loading..." }) {
  return (
    <div style={{ padding: 24, textAlign: "center" }}>
      <div style={{ fontSize: 24 }} aria-hidden>
        ⏳
      </div>
      <div style={{ marginTop: 8 }}>{message}</div>
    </div>
  );
}
