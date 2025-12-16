// components/PlacePerks.tsx
import { Box, Typography, Grid, Paper } from "@mui/material";

import {
  Wifi as WifiIcon,
  LocalParking as ParkingIcon,
  Tv as TvIcon,
  Radio as RadioIcon,
  Pets as PetsIcon,
  Kitchen as KitchenIcon,
  AcUnit as AcUnitIcon,
  Pool as PoolIcon,
  FitnessCenter as GymIcon,
  HotTub as HotTubIcon,
  LocalLaundryService as LaundryIcon,
  Deck as BalconyIcon,
  Yard as GardenIcon,
} from "@mui/icons-material";

export const perksList = [
  { value: "wifi", label: "Wifi", icon: <WifiIcon /> },
  { value: "parking", label: "Free parking", icon: <ParkingIcon /> },
  { value: "tv", label: "TV", icon: <TvIcon /> },
  { value: "radio", label: "Radio", icon: <RadioIcon /> },
  { value: "pets", label: "Pets allowed", icon: <PetsIcon /> },
  { value: "kitchen", label: "Full kitchen", icon: <KitchenIcon /> },
  { value: "ac", label: "Air conditioning", icon: <AcUnitIcon /> },
  { value: "pool", label: "Swimming pool", icon: <PoolIcon /> },
  { value: "gym", label: "Gym", icon: <GymIcon /> },
  { value: "hottub", label: "Hot tub", icon: <HotTubIcon /> },
  { value: "laundry", label: "Washer & dryer", icon: <LaundryIcon /> },
  { value: "balcony", label: "Balcony/Terrace", icon: <BalconyIcon /> },
  { value: "garden", label: "Garden", icon: <GardenIcon /> },
];

const mapToPerkItem = (perkName) => {
  return perksList.find((pi) => pi.value === perkName);
};

export const Perks = ({ perks }) => {
  const availablePerks = perks?.map?.(mapToPerkItem);

  if (
    perks == null ||
    perks.length === 0 ||
    availablePerks == null ||
    availablePerks.length === 0
  ) {
    return (
      <Typography>No amenities or perks listed for this place yet.</Typography>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gap: 3,
        gridTemplateColumns: {
          xs: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
        },
      }}
    >
      {availablePerks.map((eachPerk) => {
        return (
          <Paper
            key={eachPerk.value}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              py: 1,
            }}
          >
            {eachPerk.icon}
            <Typography variant="body2" fontWeight={600}>
              {eachPerk.label}
            </Typography>
          </Paper>
        );
      })}
    </Box>
  );
};
