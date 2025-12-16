import { Link } from "react-router-dom";
import { useCallback, useContext } from "react";
import AccountNav from "../components/AccountNav";
import BookingInfo from "../components/BookingInfo";
import { useUserBookings } from "../data/bookings";
import { UserContext } from "../UserContext";
import { DataRenderer } from "../components/DataRenderer";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { MAX_CONTENT_WIDTH } from "../constants/layout";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Stack,
} from "@mui/material";
import { RESOURCE_URL } from "../constants/api";

export default function BookingsPage() {
  const { user } = useContext(UserContext);
  const { data: bookings, isLoading, error } = useUserBookings(user?.id);

  const renderContent = useCallback(() => {
    if (!bookings || bookings.length === 0) {
      return (
        <Container maxWidth="md">
          <AccountNav />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "50vh",
              textAlign: "center",
              color: "text.secondary",
            }}
          >
            <Typography variant="h5" gutterBottom>
              No bookings yet
            </Typography>
            <Typography variant="body1">
              When you create a booking, it will appear here.
            </Typography>
          </Box>
        </Container>
      );
    }

    return (
      <Container sx={{ maxWidth: MAX_CONTENT_WIDTH }}>
        <AccountNav />

        <Stack spacing={3}>
          {bookings.map((booking) => (
            <Card
              key={booking.id}
              elevation={2}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 8,
                },
              }}
            >
              <CardActionArea
                component={Link}
                to={`/account/bookings/${booking.id}`}
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignItems: { xs: "center", md: "stretch" },
                  textDecoration: "none",
                  height: "100%",
                }}
              >
                {/* Image */}
                <CardMedia
                  component="img"
                  image={`${RESOURCE_URL}/${booking.placeCover}`}
                  alt={booking.placeTitle}
                  sx={{
                    width: 220,
                    height: 220,
                    objectFit: "cover",
                    flexShrink: 0,
                    borderRadius: 2,
                    m: 2,
                  }}
                />

                {/* Content */}
                <CardContent
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    py: 3,
                    pr: 4,
                  }}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        fontWeight: 700,
                        borderBottom: 3,
                        borderColor: "primary.main",
                        pb: 1,
                        display: "inline-block",
                      }}
                    >
                      {booking.placeTitle}
                    </Typography>

                    <Box mt={2}>
                      <BookingInfo booking={booking} />
                    </Box>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Stack>
      </Container>
    );
  }, [bookings]);

  return (
    <DataRenderer
      normalContent={renderContent}
      error={error}
      loading={isLoading}
    />
  );
}
