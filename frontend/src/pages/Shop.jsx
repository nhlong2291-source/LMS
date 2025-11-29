import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import api from "../api/axios";

export default function Shop() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api
      .get("/shop/items")
      .then((res) => setItems(res.data))
      .catch((err) => console.error(err));
  }, []);

  const buy = async (itemId) => {
    try {
      await api.post("/shop/purchase", { itemId });
      alert("Purchased");
    } catch (err) {
      console.error(err);
      alert("Purchase failed");
    }
  };

  return (
    <Container sx={{ mt: 2 }}>
      <Typography variant="h4">Shop</Typography>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {items.map((it) => (
          <Grid item xs={12} md={4} key={it._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{it.name}</Typography>
                <Typography>{it.description}</Typography>
                <Typography sx={{ my: 1 }}>${it.price}</Typography>
                <Button variant="contained" onClick={() => buy(it._id)}>
                  Buy
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
