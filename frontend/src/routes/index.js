import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Lazy imports to keep initial bundle small — replace with actual page imports
const Home = React.lazy(() => import("../pages/Home"));
const NotFound = React.lazy(() => import("../pages/NotFound"));

export default function AppRoutes({ children }) {
  return (
    <BrowserRouter>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </React.Suspense>
      {children}
    </BrowserRouter>
  );
}
