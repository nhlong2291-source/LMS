import React, { createContext, useContext, useState, useEffect } from "react";

const RoleContext = createContext(null);

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState(() => {
    try {
      return localStorage.getItem("user_role") || "student";
    } catch (e) {
      return "student";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("user_role", role);
    } catch (e) {
      // ignore storage errors in strict environments
    }
  }, [role]);

  const value = { role, setRole };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};

export const useRole = () => {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within a RoleProvider");
  return ctx;
};

export default RoleProvider;
