import { useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
import { UserContext } from "../UserContext";

import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Button,
  Stack,
  useTheme,
  useMediaQuery,
  Tooltip,
} from "@mui/material";

import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function Header() {
  const { user } = useContext(UserContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "background.default",
        borderBottom: 1,
        borderColor: "divider",
        py: { xs: 0.5, sm: 1 },
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, sm: 4 } }}>
        <Button
          component={RouterLink}
          to="/"
          sx={{
            textTransform: "none",
            borderRadius: 3,
            px: 2,
            py: 1,
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <FlightTakeoffIcon
              sx={{
                fontSize: { xs: 28, sm: 34 },
                color: "primary.main",
                transform: "rotate(45deg)",
              }}
            />
            {!isMobile && (
              <Typography
                variant="h5"
                fontWeight={800}
                sx={{
                  background: "linear-gradient(90deg, #FF385C, #E61E4D)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "-0.5px",
                }}
              >
                HomeShare
              </Typography>
            )}
            {isMobile && (
              <Typography variant="h6" fontWeight={800} color="primary">
                HomeShare
              </Typography>
            )}
          </Stack>
        </Button>

        <Tooltip title={user ? "Open account menu" : "Log in or sign up"}>
          <Button
            component={RouterLink}
            to={user ? "/account" : "/login"}
            variant="outlined"
            color="inherit"
            aria-label={user ? "Account menu" : "Log in"}
            sx={{
              borderRadius: 10,
              textTransform: "none",
              borderColor: "grey.300",
              px: { xs: 1.5, sm: 3 },
              py: 1.2,
              bgcolor: "background.paper",
              "&:hover": {
                borderColor: "grey.400",
                bgcolor: "grey.50",
                boxShadow: 3,
                transform: "translateY(-1px)",
              },
              transition: "all 0.2s ease",
              minWidth: "auto",
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <MenuIcon sx={{ fontSize: 22, color: "text.secondary" }} />

              {user ? (
                <>
                  <Avatar
                    sx={{
                      width: { xs: 32, sm: 36 },
                      height: { xs: 32, sm: 36 },
                      bgcolor: "primary.main",
                      fontSize: "1rem",
                      fontWeight: 600,
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>

                  {!isMobile && (
                    <Typography
                      variant="body1"
                      fontWeight={600}
                      sx={{ color: "text.primary" }}
                    >
                      {user.name.split(" ")[0]}
                    </Typography>
                  )}
                </>
              ) : (
                <>
                  <AccountCircleIcon
                    sx={{ fontSize: 30, color: "text.secondary" }}
                  />

                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: "text.primary",
                      fontSize: isMobile ? "0.75rem" : "1rem",
                    }}
                  >
                    Log in
                  </Typography>
                </>
              )}
            </Stack>
          </Button>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}