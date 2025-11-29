import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  List,
  ListItem,
  Button,
  TextField,
  Box,
} from "@mui/material";
import api from "../api/axios";

export default function Forum() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    api
      .get("/forum")
      .then((res) => setPosts(res.data))
      .catch((err) => console.error(err));
  }, []);

  const submit = async () => {
    try {
      const res = await api.post("/forum", { content });
      setPosts((p) => [res.data, ...p]);
      setContent("");
    } catch (err) {
      console.error(err);
      alert("Could not post");
    }
  };

  return (
    <Container sx={{ mt: 2 }}>
      <Typography variant="h4">Forum</Typography>
      <Box sx={{ my: 2 }}>
        <TextField
          multiline
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          fullWidth
        />
        <Button sx={{ mt: 1 }} variant="contained" onClick={submit}>
          Post
        </Button>
      </Box>
      <List>
        {posts.map((post) => (
          <ListItem
            key={post._id}
            sx={{ flexDirection: "column", alignItems: "flex-start" }}
          >
            <Typography variant="subtitle2">
              {post.user?.username || post.user}
            </Typography>
            <Typography>{post.content}</Typography>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}
