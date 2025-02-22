"use client";

import { useAuth } from "@/context/AuthContext";
import { AppBar, Toolbar, Typography } from "@mui/material";

export default function AdminAppBar() {
  const { user } = useAuth();
  return (
    <AppBar position="sticky">
      <Toolbar sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Typography variant="h6">{user.name}</Typography>
      </Toolbar>
    </AppBar>
  );
}
