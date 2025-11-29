import React, { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Container,
  Typography,
  List,
  ListItem,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Box,
  Skeleton,
  Alert,
} from "@mui/material";
import api from "../api/axios";

export default function ModuleLessons() {
  const { courseId, moduleId } = useParams();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        // Fetch modules for the course and find the one we need
        const res = await api.get(`/courses/${courseId}/modules`);
        const modules = res.data || [];
        const found = modules.find((m) => String(m._id) === String(moduleId));
        if (mounted) setModule(found || null);
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.error ||
            err?.response?.statusText ||
            err.message ||
            "Error"
        );
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, [courseId, moduleId]);
  return (
    <Container sx={{ mt: 2 }}>
      <Card>
        <CardContent>
          {loading ? (
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <CircularProgress size={24} />
              <Skeleton variant="text" width={200} />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : !module ? (
            <Alert severity="info">
              Không tìm thấy module (module not found)
            </Alert>
          ) : (
            <>
              <Typography variant="h5">{module.name}</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {module.description}
              </Typography>
              <Typography variant="h6">Bài học</Typography>
              {(module.lessons || []).length === 0 ? (
                <Typography>Chưa có bài học trong module này.</Typography>
              ) : (
                <List>
                  {(module.lessons || []).map((lesson) => (
                    <ListItem
                      key={lesson._id}
                      sx={{ display: "flex", alignItems: "center", gap: 2 }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontWeight: 500 }}>
                          {lesson.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Type: {lesson.type || "unknown"}
                          {lesson.videoUrl ? (
                            <>
                              {" "}
                              {" "}
                              <a
                                href={lesson.videoUrl}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Video
                              </a>
                            </>
                          ) : null}
                        </Typography>
                      </Box>
                      <Chip label={lesson.type || "lesson"} size="small" />
                      <Button
                        component={RouterLink}
                        to={`/courses/${courseId}/modules/${moduleId}/lessons/${lesson._id}`}
                        variant="outlined"
                      >
                        Mở
                      </Button>
                    </ListItem>
                  ))}
                </List>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
