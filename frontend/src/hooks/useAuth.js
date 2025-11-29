import { useState, useEffect, useCallback } from "react";
import axios from "../api/axios";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export default function useAuth() {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch (e) {
      return null;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const login = useCallback(async (credentials) => {
    try {
      const res = await axios.post("/user/login", credentials);
      const data = res.data || {};
      const t = data.token || data.accessToken || null;
      const u = data.user || data;
      if (t) {
        setToken(t);
        localStorage.setItem(TOKEN_KEY, t);
      }
      if (u) {
        setUser(u);
        try {
          localStorage.setItem(USER_KEY, JSON.stringify(u));
        } catch (e) {}
      }
      return data;
    } catch (err) {
      // propagate error for caller to handle
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (e) {}
    delete axios.defaults.headers.common["Authorization"];
  }, []);

  const refreshFromStorage = useCallback(() => {
    try {
      const t = localStorage.getItem(TOKEN_KEY);
      const raw = localStorage.getItem(USER_KEY);
      setToken(t);
      setUser(raw ? JSON.parse(raw) : null);
    } catch (e) {
      // ignore
    }
  }, []);

  return {
    user,
    token,
    login,
    logout,
    refreshFromStorage,
    isAuthenticated: Boolean(token),
  };
}
