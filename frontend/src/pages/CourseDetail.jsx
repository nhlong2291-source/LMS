import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  Button,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Skeleton,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import api from "../api/axios";

export default function CourseDetail() {
  const { id, courseId } = useParams();
  const courseIdToUse = id || courseId;
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  function handleViewLessons(moduleId) {
    if (!courseIdToUse || !moduleId) return;
    navigate(`/courses/${courseIdToUse}/modules/${moduleId}/lessons`);
  }

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/courses/${courseIdToUse}`);
        let courseData = res.data;
        // If API didn't include modules, try the explicit modules endpoint
        if (
          (!courseData.modules || courseData.modules.length === 0) &&
          mounted
        ) {
          try {
            const mRes = await api.get(`/courses/${courseIdToUse}/modules`);
            courseData = { ...courseData, modules: mRes.data };
          } catch (mErr) {
            // ignore module fetch errors; UI will show 'No modules available'
            console.debug(
              "modules fetch failed",
              mErr?.response?.status || mErr.message
            );
          }
        }
        if (mounted) setCourse(courseData);
      } catch (err) {
        console.error(err);
        if (err.response)
          setError(`${err.response.status} ${err.response.statusText}`);
        else setError(err.message || "Unknown error");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [courseIdToUse]);

  if (loading) return <Container>Loading...</Container>;
  if (error)
    return (
      <Container sx={{ mt: 2 }}>
        <Alert severity="error">Error loading course: {error}</Alert>
      </Container>
    );
  if (!course) return <Container>Course not found</Container>;
  return (
    <Container sx={{ mt: 2 }}>
      <Card>
        <CardContent>
          <Typography variant="h4">{course.name || course.title}</Typography>
          <Typography variant="body1" sx={{ my: 2 }}>
            {course.description}
          </Typography>
          <Typography variant="h6">Modules</Typography>
          {/* Render modules as expandable accordions inline */}
          {course.modules && course.modules.length > 0 ? (
            <Box sx={{ mt: 1 }}>
              {course.modules.map((m) => (
                <Accordion key={m._id} disableGutters>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ flex: 1 }}>{m.name}</Typography>
                    <Chip
                      label={`${(m.lessons || []).length} lessons`}
                      size="small"
                    />
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {m.description}
                    </Typography>
                    {m.lessons && m.lessons.length > 0 ? (
                      <List>
                        {m.lessons.map((lesson) => (
                          <ListItem
                            key={lesson._id}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Box sx={{ flex: 1 }}>
                              <Typography sx={{ fontWeight: 500 }}>
                                {lesson.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Type: {lesson.type || "lesson"}
                              </Typography>
                            </Box>
                            <Button
                              onClick={() =>
                                navigate(
                                  `/courses/${courseIdToUse}/modules/${m._id}/lessons/${lesson._id}`
                                )
                              }
                              variant="outlined"
                            >
                              Open
                            </Button>
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Typography color="text.secondary">
                          No lessons in this module.
                        </Typography>
                        <Button
                          onClick={() => handleViewLessons(m._id)}
                          variant="outlined"
                        >
                          View lessons page
                        </Button>
                      </Box>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          ) : (
            <Typography>
              No modules available (or API doesn't expose modules).
            </Typography>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
