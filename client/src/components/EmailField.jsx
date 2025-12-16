import { Email } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";

export const EmailField = ({ value, onChange, errorMessage, disabled }) => {
  return (
    <TextField
      margin="normal"
      required
      fullWidth
      label="Email Address"
      name="email"
      autoComplete="email"
      autoFocus
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      error={!!errorMessage}
      helperText={errorMessage}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Email color="action" />
          </InputAdornment>
        ),
      }}
    />
  );
};