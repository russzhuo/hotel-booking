import { Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField } from "@mui/material";

export const PasswordField = ({
    visible,
    onVisibilityChange,
    value,
    disabled,
    onChange,
    errorMessage
}) => {
  return (
    <TextField
      margin="normal"
      required
      fullWidth
      label="Password"
      name="password"
      type={visible ? "text" : "password"}
      autoComplete="current-password"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      error={!!errorMessage}
      helperText={errorMessage}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Lock color="action" />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => onVisibilityChange(!visible)}
              edge="end"
              disabled={disabled}
            >
              {visible ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};
