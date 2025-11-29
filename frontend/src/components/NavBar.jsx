import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useAuth } from "../contexts/AuthContext";
import { Link as RouterLink } from "react-router-dom";

export default function NavBar() {
  const { user, logout } = useAuth();

  return (
    <Box sx={{ flexGrow: 1, mb: 2 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            LMS
          </Typography>
          <Button color="inherit" component={RouterLink} to="/">
            Courses
          </Button>
          <Button color="inherit" component={RouterLink} to="/forum">
            Forum
          </Button>
          <Button color="inherit" component={RouterLink} to="/shop">
            Shop
          </Button>
          {user ? (
            <>
              <Typography sx={{ mx: 2 }}>{user.username}</Typography>
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <Button color="inherit" component={RouterLink} to="/login">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
