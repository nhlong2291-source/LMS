import React, { createContext, useContext, useState, useCallback } from "react";

const ProgressContext = createContext(null);

export const ProgressProvider = ({ children }) => {
  // progress shape: { [entityId]: { completed: number, total: number } }
  const [progressMap, setProgressMap] = useState({});

  const setProgress = useCallback((id, completed, total) => {
    setProgressMap((prev) => ({ ...prev, [id]: { completed, total } }));
  }, []);

  const updateProgress = useCallback(
    (id, deltaCompleted = 0, deltaTotal = 0) => {
      setProgressMap((prev) => {
        const cur = prev[id] || { completed: 0, total: 0 };
        return {
          ...prev,
          [id]: {
            completed: cur.completed + deltaCompleted,
            total: cur.total + deltaTotal,
          },
        };
      });
    },
    []
  );

  const getProgress = useCallback(
    (id) => progressMap[id] || { completed: 0, total: 0 },
    [progressMap]
  );

  return (
    <ProgressContext.Provider
      value={{ progressMap, setProgress, updateProgress, getProgress }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const ctx = useContext(ProgressContext);
  if (!ctx)
    throw new Error("useProgress must be used within a ProgressProvider");
  return ctx;
};

export default ProgressProvider;
