// import { useContext, useState } from "react";
// import { UserContext } from "../UserContext.jsx";
// import { Link, Navigate, useParams } from "react-router-dom";
// import axios from "axios";
// import PlacesPage from "./PlacesPage";
// import AccountNav from "../components/AccountNav";

// export default function ProfilePage() {
//   const [redirect, setRedirect] = useState(null);
//   const { ready, user, setUser } = useContext(UserContext);

//   let { subpage } = useParams();
//   if (subpage === undefined) {
//     subpage = "profile";
//   }

//   async function logout() {
//     localStorage.removeItem("token");
//     setRedirect("/");
//     setUser(null);
//   }

//   if (!ready) {
//     return "Loading...";
//   }

//   if (ready && !user && !redirect) {
//     return <Navigate to={"/login"} />;
//   }

//   if (redirect) {
//     return <Navigate to={redirect} />;
//   }

//   return (
//     <div>
//       <AccountNav />
//       {subpage === "profile" && (
//         <div className="text-center max-w-lg mx-auto">
//           Logged in as {user.name} ({user.email})<br />
//           <button onClick={logout} className="primary max-w-sm mt-2">
//             Logout
//           </button>
//         </div>
//       )}
//       {subpage === "places" && <PlacesPage />}
//     </div>
//   );
// }
import { useContext, useState } from "react";
import { UserContext } from "../UserContext.jsx";
import { Navigate, useParams } from "react-router-dom";
import PlacesPage from "./PlacesPage";
import AccountNav from "../components/AccountNav";

import {
  Container,
  Box,
  Avatar,
  Typography,
  Button,
  Stack,
  Chip,
} from "@mui/material";
import {
  Email as EmailIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { api } from "../services/http-client.js";

export default function ProfilePage() {
  const [redirect, setRedirect] = useState(null);
  const { ready, user, setUser } = useContext(UserContext);

  let { subpage } = useParams();
  if (!subpage) subpage = "profile";

  async function logout() {
    // await api.post("/logout");
    localStorage.removeItem("token");
    setUser(null);
    setRedirect("/");
  }

  if (!ready) return "Loading...";
  if (ready && !user && !redirect) return <Navigate to="/login" replace />;
  if (redirect) return <Navigate to={redirect} replace />;

  return (
    <Box>
      <AccountNav />

      <Container maxWidth="sm">
        {subpage === "profile" && (
          <Stack
            spacing={4}
            alignItems="center"
            sx={{ textAlign: "center" }}
          >

            <Avatar
              sx={{
                width: { xs: 80, sm: 100 },
                height: { xs: 80, sm: 100 },
                fontSize: "2.5rem",
                bgcolor: "primary.main",
                color: "white",
                fontWeight: 600,
                boxShadow: 4,
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </Avatar>

            <Box>
              <Typography variant="h5" fontWeight={700}>
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Welcome back!
              </Typography>
            </Box>

            <Chip
              icon={<EmailIcon />}
              label={user.email}
              color="primary"
              variant="outlined"
              sx={{
                height: 42,
                fontSize: "1rem",
                px: 2,
                borderRadius: 3,
                fontWeight: 500,
              }}
            />

            <Button
              variant="contained"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={logout}
              sx={{
                bgcolor: "primary.main",
                borderRadius: 3,
                textTransform: "none",
                fontSize: "1.05rem",
                fontWeight: 600,
                px: 5,
                py: 1.5,
                boxShadow: 3,
                "&:hover": {
                  boxShadow: 6,
                  bgcolor: "error.dark",
                },
              }}
            >
              Logout
            </Button>
          </Stack>
        )}

        {subpage === "places" && <PlacesPage />}
      </Container>
    </Box>
  );
}