"use client";

import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import AdminAppBar from "./AdminAppBar";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const token = useAuth();
  
  const noLayoutPaths = ["/login", "/signup", "/forgot-password"];

  if (!token) return null; 

  if (noLayoutPaths.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar />

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflowY: "scroll",
        }}
      >
        <AdminAppBar />

        <Box sx={{ flexGrow: 1, overflowY: "auto", padding: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

