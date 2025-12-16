import { Box } from "@mui/material";
import Header from "./Header";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f8f9f9aa",
        color: "text.primary",
      }}
    >
      <Header />
      <Box sx={{ mx: 2 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
