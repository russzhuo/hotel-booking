import { Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function ActionButton({
  to,
  children,
  startIcon,
  sx,
  ...props
}) {
  return (
    <Button
      component={to ? Link : "button"}
      to={to}
      startIcon={startIcon}
      variant="contained"
      color="primary"
      sx={{
        borderRadius: 8,
        textTransform: "none",
        fontWeight: 600,
        fontSize: "1rem",
        px: { xs: 3, md: 4 },
        py: 1.8,
        mx: { xs: 2, md: 4 },
        boxShadow: 4,
        "&:hover": {
          bgcolor: "primary.dark",
          boxShadow: 8,
        },
        transition: "all 0.25s ease-in-out",
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
}