// import {Link, Navigate} from "react-router-dom";
// import {useContext, useState} from "react";
// import axios from "axios";
// import { UserContext } from "../UserContext";
// import { api } from "../services/http-client";
// import { toast } from "react-toastify";
// // import {UserContext} from "../UserContext.jsx";

// export default function LoginPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [redirect, setRedirect] = useState(false);
//   const { setUser } = useContext(UserContext);

//   async function handleLoginSubmit(ev) {
//     ev.preventDefault();
//     try {
//       const { data } = await api.post('/auth/login', {email,password});
//       setUser(data);

//       const token = data.data.token;
//       localStorage.setItem("token", token);
//       console.log('data: ', data);
//       // alert('Login successful');
//       setRedirect(true);
//     } catch (e) {
//       toast.error('Login failed');
//     }
//   }

//   if (redirect) {
//     return <Navigate to={'/'} />
//   }

//   return (
//     <div className="mt-4 grow flex items-center justify-around">
//       <div className="mb-64">
//         <h1 className="text-4xl text-center mb-4">Login</h1>
//         <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
//           <input type="email"
//                  placeholder="your@email.com"
//                  value={email}
//                  onChange={ev => setEmail(ev.target.value)} />
//           <input type="password"
//                  placeholder="password"
//                  value={password}
//                  onChange={ev => setPassword(ev.target.value)} />
//           <button className="primary">Login</button>
//           <div className="text-center py-2 text-gray-500">
//             Don't have an account yet? <Link className="underline text-black" to={'/register'}>Register now</Link>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
import { useState, useContext, useMemo } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Avatar,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";
import {
  Login as LoginIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { UserContext } from "../UserContext";
import { api } from "../services/http-client";
import { toast } from "react-toastify";
import { emailValidator, passwordValidator } from "../helpers/validation";
import { PasswordField } from "../components/PasswordField";
import { EmailField } from "../components/EmailField";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailError = useMemo(() => {
    return emailValidator(email);
  }, [email]);

  const passwordError = useMemo(() => {
    return passwordValidator(password);
  }, [password]);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [redirect, setRedirect] = useState(false);

  const { setUser } = useContext(UserContext);

  const isFormInfoValid = [passwordError, emailError].every((err) => !err);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", { email, password });

      // Store token
      localStorage.setItem("token", data.data.token);

      // Update global user context
      setUser(data.data.user || data.data);

      toast.success("Welcome back!");

      setRedirect(true);
    } catch (err) {
      const message =
        err.response?.data?.message || "Invalid email or password";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (redirect) {
    return <Navigate to="/" replace />;
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.main", width: 56, height: 56 }}>
          <LoginIcon fontSize="large" />
        </Avatar>

        <Typography component="h1" variant="h4" fontWeight={600}>
          Welcome back
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1, mb: 4 }}
        >
          Log in to your account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper
          elevation={0}
          sx={{
            width: "100%",
            mt: 3,
            p: { xs: 2, sm: 4 },
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <EmailField
              value={email}
              onChange={(v) => setEmail(v)}
              errorMessage={emailError}
              disabled={loading}
            />

            <PasswordField
              value={password}
              visible={showPassword}
              onVisibilityChange={(visible) => setShowPassword(visible)}
              onChange={(v) => setPassword(v)}
              errorMessage={passwordError}
              disabled={loading}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading || !isFormInfoValid}
              sx={{ mt: 4, mb: 2, py: 1.6 }}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <Divider sx={{ my: 4 }}>
              <Typography variant="body2" color="text.secondary">
                or
              </Typography>
            </Divider>

            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{" "}
                <Button
                  component={Link}
                  to="/register"
                  variant="text"
                  sx={{ textTransform: "none", fontWeight: 600 }}
                >
                  Register
                </Button>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
