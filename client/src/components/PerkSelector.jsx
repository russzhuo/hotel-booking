// components/Perks.tsx
import {
  Box,
  FormControlLabel,
  Checkbox,
  Typography,
  Chip,
} from "@mui/material";
import { perksList } from "./Perks";


export default function PerkSelector({
  selected = [],
  onChange,
  disabled = false,
}) {
  const handleToggle = (value) => {
    console.log("handleToggle: ", value);
    if (disabled) return;

    const newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];

    // console.log("newSelected: ", newSelected);
    onChange(newSelected);
  };

  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: {
          xs: "repeat(2, 1fr)",
          sm: "repeat(3, 1fr)",
          md: "repeat(4, 1fr)",
          lg: "repeat(5, 1fr)",
        },
      }}
    >
      {perksList.map(({ value, label, icon }) => {
        const isSelected = selected
          .map((selectedItem) => selectedItem.toLowerCase())
          .includes(value);

        return (
          <FormControlLabel
            key={value}
            control={
              <Checkbox
                checked={isSelected}
                disabled={disabled}
                sx={{ display: "none" }}
              />
            }
            label={
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  py: 1,
                  borderRadius: 3,
                  border: "2px solid",
                  borderColor: isSelected ? "primary.main" : "grey.300",
                  bgcolor: isSelected ? "primary.50" : "background.paper",
                  cursor: disabled ? "not-allowed" : "pointer",
                  opacity: disabled ? 0.6 : 1,
                  transition: "all 0.2s",
                  "&:hover": {
                    borderColor: disabled ? "grey.300" : "primary.main",
                    bgcolor: isSelected ? "primary.100" : "grey.50",
                  },
                }}
                onClick={() => handleToggle(value)}
              >
                {icon}
                <Typography variant="body2" fontWeight={600}>
                  {label}
                </Typography>
                {isSelected && (
                  <Chip label="Selected" size="small" color="primary" />
                )}
              </Box>
            }
            sx={{
              m: 0,
              width: "100%",
              "& .MuiFormControlLabel-label": { width: "100%" },
            }}
          />
        );
      })}
    </Box>
  );
}
