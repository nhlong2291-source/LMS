import React from "react";

export default function GemBalanceWidget({ balance = 0 }) {
  return (
    <div style={{ padding: 12 }}>
      <h5>Gems</h5>
      <div>{balance}</div>
    </div>
  );
}
