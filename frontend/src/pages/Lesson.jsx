import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Paper, Button } from "@mui/material";
import api from "../api/axios";

export default function Lesson() {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lessonId) return;
    api
      .get(`/lessons/${lessonId}`)
      .then((res) => setLesson(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [lessonId]);

  if (loading) return <Container>Loading...</Container>;
  if (!lesson)
    return <Container>Lesson not found or endpoint missing.</Container>;

  return (
    <Container sx={{ mt: 2 }}>
      <Typography variant="h4">{lesson.name}</Typography>
      <Paper sx={{ p: 2, mt: 2 }}>
        {lesson.type === "video" && lesson.videoUrl ? (
          <video src={lesson.videoUrl} controls style={{ width: "100%" }} />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: lesson.content || "" }} />
        )}
      </Paper>
      <Button
        sx={{ mt: 2 }}
        onClick={async () => {
          try {
            await api.post("/progress", { lesson: lesson._id, progress: 100 });
            alert("Marked as completed");
          } catch (err) {
            console.error(err);
            alert("Could not update progress");
          }
        }}
      >
        Mark Complete
      </Button>
    </Container>
  );
}
