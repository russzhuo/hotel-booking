import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Avatar,
  Stack,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Password, PersonAdd as PersonAddIcon } from "@mui/icons-material";
import { useRegister } from "../data/auth";
import {
  emailValidator,
  nameValidator,
  passwordValidator,
} from "../helpers/validation";
import { toast } from "react-toastify";
import { EmailField } from "../components/EmailField";
import { PasswordField } from "../components/PasswordField";
import { NameField } from "../components/NameField";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const nameError = useMemo(() => {
    return nameValidator(name);
  }, [name]);

  const passwordError = useMemo(() => {
    return passwordValidator(password);
  }, [password]);

  const emailError = useMemo(() => {
    return emailValidator(email);
  }, [email]);

  const isFormInfoValid = [nameError, passwordError, emailError].every(
    (err) => !err
  );

  const {
    mutate: register,
    isPending,
    isError,
    error: mutationError,
  } = useRegister();

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormInfoValid) {
      return;
    }

    register(
      { name, email, password },
      {
        onSuccess: () => {
          navigate("/login?registered=true");
        },
        onError: (err) => {
          console.error(err.message);
          toast.error("Registration failed. Try again");
        },
      }
    );
  };

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
          <PersonAddIcon fontSize="large" />
        </Avatar>

        <Typography component="h1" variant="h4" fontWeight={600}>
          Create your account
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1, mb: 3 }}
        >
          Join us today — it takes less than a minute
        </Typography>

        {isError && (
          <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
            {"Something went wrong. Please try again."}
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
            <Stack spacing={3}>
              <NameField
                value={name}
                onChange={(v) => setName(v)}
                disabled={isPending}
                errorMessage={nameError}
              />

              <EmailField
                onChange={(v) => setEmail(v)}
                errorMessage={emailError}
                value={email}
                disabled={isPending}
              />

              <PasswordField
                value={password}
                onChange={(v) => setPassword(v)}
                errorMessage={passwordError}
                disabled={isPending}
                visible={showPassword}
                onVisibilityChange={(visible) => setShowPassword(visible)}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isPending || !isFormInfoValid}
                sx={{ mt: 2, py: 1.5 }}
              >
                {isPending ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Creating Account...
                  </>
                ) : (
                  "Register"
                )}
              </Button>
            </Stack>

            <Divider sx={{ my: 4 }}>
              <Typography variant="body2" color="text.secondary">
                or
              </Typography>
            </Divider>

            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Already have an account?{" "}
                <Button
                  component={Link}
                  to="/login"
                  variant="text"
                  sx={{ textTransform: "none", fontWeight: 600 }}
                >
                  Sign in
                </Button>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
