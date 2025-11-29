import api from "./axios";

export async function fetchCourses() {
  const res = await api.get("/courses");
  return res.data;
}

export async function fetchCourse(courseId) {
  const res = await api.get(`/courses/${courseId}`);
  return res.data;
}

export async function fetchModules(courseId) {
  const res = await api.get(`/courses/${courseId}/modules`);
  return res.data;
}

export async function fetchLesson(lessonId) {
  const res = await api.get(`/lessons/${lessonId}`);
  return res.data;
}
