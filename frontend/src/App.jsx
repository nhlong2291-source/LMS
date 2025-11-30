import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// --- 1. Import Context & Layout ---
import { useAuth } from "./context/AuthContext"; // Dùng folder 'context' (không s)
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// --- 2. Import Feature: Auth ---
import LoginPage from "./features/auth/LoginPage";

// --- 3. Import Feature: Courses ---
// Chú ý: Import đúng từ folder 'features/courses/pages'
import Dashboard from "./features/courses/pages/Dashboard";
import CourseCatalog from "./features/courses/pages/CourseCatalog";
import CourseLearning from "./features/courses/pages/CourseLearning";
import CourseBuilder from "./features/courses/pages/CourseBuilder";
import CourseCurriculum from "./features/courses/pages/CourseCurriculum";
import CourseDetail from "./features/courses/pages/CourseDetail";

// --- 4. Import Feature: Admin ---
// Chú ý: Dựa trên cây thư mục của bạn, file này nằm ngay trong features/admin
// Explicit extension can help Vite resolve during HMR in some environments
import UserList from "./features/admin/components/UserList";
import ImportUsers from "./features/admin/components/ImportUsers";
import EnrollmentRequests from "./features/admin/EnrollmentRequests.jsx";

// Các trang phụ
const Unauthorized = () => (
  <div className="p-8 text-red-600 text-xl font-bold">⛔ 403 - Bạn không có quyền truy cập!</div>
);
const NotFound = () => <div className="p-8 text-gray-600 text-xl">🔍 404 - Không tìm thấy trang</div>;

function App() {
  return (
    <Routes>
      {/* --- PUBLIC ROUTES --- */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/courses/:id/detail" element={<CourseDetail />} />
      {/* --- PROTECTED ROUTES (CÓ MENU SIDEBAR) --- */}
      {/* Mọi thứ nằm trong cặp thẻ này sẽ có Sidebar & Header */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Redirect mặc định về Dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* --- COMMON ROUTES (Ai cũng thấy) --- */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses" element={<CourseCatalog />} />
        <Route path="/courses/:id" element={<CourseLearning />} />

        {/* --- ADMIN / INSTRUCTOR ROUTES (Chỉ Admin thấy) --- */}
        <Route element={<ProtectedRoute allowedRoles={["admin", "manager", "instructor"]} />}>
          {/* Quản lý User */}
          <Route path="/admin/users" element={<UserList />} />
          <Route path="/admin/import" element={<ImportUsers />} />

          {/* Quản lý Khóa học */}
          <Route path="/admin/courses/create" element={<CourseBuilder />} />
          <Route path="/admin/courses/:id/curriculum" element={<CourseCurriculum />} />
          <Route path="/admin/enrollments" element={<EnrollmentRequests />} />
        </Route>
      </Route>

      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
