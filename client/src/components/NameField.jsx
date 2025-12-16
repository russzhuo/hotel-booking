import { Person } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";

export const NameField = ({ value, onChange, disabled, errorMessage }) => {
  return (
    <TextField
      required
      fullWidth
      label="Full Name"
      name="name"
      autoComplete="name"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      error={!!errorMessage}
      helperText={errorMessage}
      autoFocus
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Person color="action" />
          </InputAdornment>
        ),
      }}
    />
  );
};
