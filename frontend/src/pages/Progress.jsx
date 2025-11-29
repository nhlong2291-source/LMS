import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  LinearProgress,
  List,
  ListItem,
} from "@mui/material";
import api from "../api/axios";

export default function Progress() {
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    api
      .get("/progress")
      .then((res) => setProgress(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Container sx={{ mt: 2 }}>
      <Typography variant="h4" gutterBottom>
        My Progress
      </Typography>
      <List>
        {progress.map((p) => (
          <ListItem
            key={p._id}
            sx={{ flexDirection: "column", alignItems: "stretch" }}
          >
            <Typography>{p.lessonName || p.lesson}</Typography>
            <LinearProgress
              variant="determinate"
              value={p.progress || 0}
              sx={{ width: "100%", mt: 1 }}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
