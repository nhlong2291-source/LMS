import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-50 p-4">
        <nav>
          <ul>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/courses">Courses</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
