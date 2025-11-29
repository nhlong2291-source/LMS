import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import ModuleLessons from "./pages/ModuleLessons";
import Lesson from "./pages/Lesson";
import Progress from "./pages/Progress";
import Forum from "./pages/Forum";
import Shop from "./pages/Shop";
import NavBar from "./components/NavBar";
import { useAuth } from "./contexts/AuthContext";

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <>
              <NavBar />
              <Courses />
            </>
          </RequireAuth>
        }
      />
      <Route
        path="/courses/:id"
        element={
          <RequireAuth>
            <>
              <NavBar />
              <CourseDetail />
            </>
          </RequireAuth>
        }
      />
      <Route
        path="/courses/:courseId/modules/:moduleId/lessons"
        element={
          <RequireAuth>
            <>
              <NavBar />
              <ModuleLessons />
            </>
          </RequireAuth>
        }
      />
      <Route
        path="/courses/:courseId/modules/:moduleId/lessons/:lessonId"
        element={
          <RequireAuth>
            <>
              <NavBar />
              <Lesson />
            </>
          </RequireAuth>
        }
      />
      <Route
        path="/progress"
        element={
          <RequireAuth>
            <>
              <NavBar />
              <Progress />
            </>
          </RequireAuth>
        }
      />
      <Route
        path="/forum"
        element={
          <RequireAuth>
            <>
              <NavBar />
              <Forum />
            </>
          </RequireAuth>
        }
      />
      <Route
        path="/shop"
        element={
          <RequireAuth>
            <>
              <NavBar />
              <Shop />
            </>
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
