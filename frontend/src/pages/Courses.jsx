import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import api from "../api/axios";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/courses")
      .then((res) => setCourses(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Courses
      </Typography>
      {loading && <Typography>Loading...</Typography>}
      <Grid container spacing={2}>
        {courses.map((c) => (
          <Grid item xs={12} md={6} key={c._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{c.title || c.name}</Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {c.description}
                </Typography>
                <Button component={RouterLink} to={`/courses/${c._id}`}>
                  View
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
