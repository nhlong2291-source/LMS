import api from "./axios";

export async function login({ username, password }) {
  const res = await api.post("/user/login", { username, password });
  return res.data;
}

export async function fetchProfile() {
  const res = await api.get("/user/profile");
  return res.data;
}
