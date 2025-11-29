import React, { createContext, useContext, useState, useCallback } from "react";

const EnrollmentContext = createContext(null);

export const EnrollmentProvider = ({ children }) => {
  const [enrolled, setEnrolled] = useState(() => []);

  const enroll = useCallback((courseId) => {
    setEnrolled((prev) =>
      prev.includes(courseId) ? prev : [...prev, courseId]
    );
  }, []);

  const unenroll = useCallback((courseId) => {
    setEnrolled((prev) => prev.filter((id) => id !== courseId));
  }, []);

  const isEnrolled = useCallback(
    (courseId) => enrolled.includes(courseId),
    [enrolled]
  );

  return (
    <EnrollmentContext.Provider
      value={{ enrolled, enroll, unenroll, isEnrolled }}
    >
      {children}
    </EnrollmentContext.Provider>
  );
};

export const useEnrollment = () => {
  const ctx = useContext(EnrollmentContext);
  if (!ctx)
    throw new Error("useEnrollment must be used within an EnrollmentProvider");
  return ctx;
};

export default EnrollmentProvider;
