"use client";

import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useRouter } from "next/navigation";
import Iconify from "./iconify";
import Image from "next/image";

const menuItems = [
  { label: "Dashboard", path: "/", icon: "mdi:view-dashboard" },
  { label: "Onboarding", path: "/onboarding", icon: "mdi:shopping" },
];

export default function Sidebar() {
  const router = useRouter();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 250,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 250,
          boxSizing: "border-box",
          overflowY: "auto",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 2,
          borderBottom: "1px solid #ddd",
          cursor: "pointer",
        }}
        onClick={() => router.push("/")}
      >
        {/* <Image
          src="/path/to/your/logo.png"
          alt="Logo"
          width={160}
          height={40}
          style={{ objectFit: "contain" }}
        />{" "} */}
        LOGO
      </Box>

      <List>
        {menuItems.map((item, index) => (
          <ListItemButton key={index} onClick={() => router.push(item.path)}>
            <ListItemIcon>
              <Iconify icon={item.icon} width={24} />
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
