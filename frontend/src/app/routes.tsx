import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Lazy imports or feature page imports go here

export default function RoutesRoot() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      {/* Placeholder route - replace with feature routes */}
      <Route path="/dashboard" element={<div>Dashboard (placeholder)</div>} />
    </Routes>
  );
}
