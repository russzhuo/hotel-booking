import { useParams } from "react-router-dom";
import { useCallback } from "react";
import PlaceGallery from "../components/PlaceGallery";
import BookingWidget from "../components/BookingWidget";
import AddressLink from "../components/AddressLink";
import { usePlaceDetails } from "../data/places";
import { DataRenderer } from "../components/DataRenderer";
import { MAX_CONTENT_WIDTH_PX } from "../constants/layout";
import { Box, Typography, Divider, Grid } from "@mui/material";
import { Perks } from "../components/Perks";

export default function PlacePage() {
  const { id } = useParams();
  const { data: place, error, isLoading } = usePlaceDetails(id);

  const renderContent = useCallback(() => {
    return (
      <Box
        sx={{
          mt: 3,
          mx: "auto",
          maxWidth: MAX_CONTENT_WIDTH_PX,
          px: { xs: 2, sm: 3 },
        }}
      >
        {/* Title */}
        <Typography variant="h3" component="h1" fontWeight={600} gutterBottom>
          {place.title}
        </Typography>

        {/* Address */}
        <AddressLink sx={{ my: 3, display: "block" }}>
          {place.address}
        </AddressLink>

        {/* Gallery */}
        <PlaceGallery place={place} />

        {/* Main Content Grid */}
        <Grid container spacing={{ xs: 6, md: 10 }} sx={{ mt: 6 }}>
          {/* Left Column: Description, Info, Perks */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {/* Description */}
              <Box>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Description
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  whiteSpace="pre-line"
                >
                  {place.description}
                </Typography>
              </Box>

              <Divider />

              {/* Check-in / Check-out / Guests */}
              <Box sx={{ py: 2 }}>
                <Typography variant="body1" component="div">
                  <strong>Check-in:</strong> {place.checkIn} pm
                </Typography>
                <Typography variant="body1" component="div" sx={{ mt: 1 }}>
                  <strong>Check-out:</strong> {place.checkOut} am
                </Typography>
                <Typography variant="body1" component="div" sx={{ mt: 1 }}>
                  <strong>Max number of guests:</strong> {place.maxGuests}
                </Typography>
              </Box>

              <Divider />

              {/* Extra Info */}
              {place.extraInfo && (
                <Box>
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    Extra info
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    whiteSpace="pre-line"
                    sx={{ mt: 1, lineHeight: 1.7 }}
                  >
                    {place.extraInfo}
                  </Typography>
                </Box>
              )}

              <Divider />

              {/* Perks */}
              <Box
                sx={{
                  mb: { xs: 4 },
                }}
              >
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  What this place offers
                </Typography>
                <Box sx={{ mt: 3 }}>
                  <Perks perks={place.perks}  />
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Booking Widget */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                position: { md: "sticky" },
                top: { md: `108px` },
                mb: { xs: 4 },
              }}
            >
              <BookingWidget place={place} />
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  }, [place]);

  return (
    <DataRenderer
      error={error}
      loading={isLoading}
      normalContent={renderContent}
    />
  );
}
