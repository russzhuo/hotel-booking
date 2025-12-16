import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useState } from "react";
import { useBookingDetails } from "../data/bookings";
import { DataRenderer } from "../components/DataRenderer";

import {
  Box,
  Container,
  Paper,
  Typography,
  Divider,
  Stack,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogActions,
  DialogContent,
  CircularProgress,
} from "@mui/material";
import {
  CalendarToday,
  LocationOn,
  Person,
  AttachMoney,
  Cancel,
  AccessTime,
} from "@mui/icons-material";
import dayjs from "dayjs";
import { RESOURCE_URL } from "../constants/api";

export default function BookingDetails() {
  const { id: bookingId } = useParams();
  const [open, setOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const {
    data: booking,
    isLoading: loading,
    error,
    cancel,
  } = useBookingDetails(bookingId);

  const navigate = useNavigate();

  const renderContent = useCallback(
    () => (
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            sx={{ minHeight: { md: 400 } }}
          >
            {/* Image */}
            <Box
              sx={{
                flex: { md: "0 0 45%" },
                minHeight: { xs: 300, md: 500 },
                bgcolor: "grey.300",
                backgroundImage: `url(${RESOURCE_URL}/${booking.placeCover})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            {/* Details */}
            <Box sx={{ flex: 1, p: { xs: 4, md: 6 } }}>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                {booking.placeTitle}
              </Typography>

              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                color="text.secondary"
                mb={3}
              >
                <LocationOn fontSize="small" />
                <Typography>{booking.placeAddress}</Typography>
              </Stack>

              <Divider sx={{ my: 3 }} />

              <Stack spacing={4}>
                {/* Guest */}
                <Stack direction="row" spacing={3} alignItems="center">
                  <Person color="action" sx={{ fontSize: 32 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Guest
                    </Typography>
                    <Typography fontWeight={600}>{booking.username}</Typography>
                  </Box>
                </Stack>

                {/* Check-in / Check-out */}
                <Stack direction={{ xs: "column", sm: "row" }} spacing={4}>
                  <Stack direction="row" spacing={3} alignItems="center">
                    <CalendarToday color="action" sx={{ fontSize: 32 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Check-in
                      </Typography>
                      <Typography fontWeight={600}>
                        {dayjs(booking.checkIn).format("ddd, D MMM YYYY")}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {dayjs(booking.checkIn).format("h:mm A")}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={3} alignItems="center">
                    <CalendarToday color="action" sx={{ fontSize: 32 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Check-out
                      </Typography>
                      <Typography fontWeight={600}>
                        {dayjs(booking.checkOut).format("ddd, D MMM YYYY")}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {dayjs(booking.checkOut).format("h:mm A")}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>

                {/* Price */}
                <Stack direction="row" spacing={3} alignItems="center">
                  <AttachMoney sx={{ color: "success.main", fontSize: 32 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Paid
                    </Typography>
                    <Typography
                      variant="h5"
                      fontWeight={700}
                      color="success.main"
                    >
                      ${booking.price.toFixed(2)}
                    </Typography>
                  </Box>
                </Stack>

                {/* Booked On */}
                <Stack direction="row" spacing={3} alignItems="center">
                  <AccessTime color="action" sx={{ fontSize: 32 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Booking Date
                    </Typography>
                    <Typography>
                      {dayjs(booking.createdAt).format(
                        "D MMMM YYYY [at] h:mm A"
                      )}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>

              <Box
                sx={{
                  mt: 5,
                  w: 1,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Chip label="Confirmed" color="success" size="medium" />

                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Cancel />}
                  onClick={() => setOpen(true)}
                  sx={{
                    textTransform: "none",
                  }}
                >
                  {"Cancel Booking"}
                </Button>

                <Dialog open={open} onClose={() => setOpen(false)}>
                  <DialogTitle>Are you sure you want to cancel?</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      {`You’re about to permanently cancel your stay at ${booking.placeTitle}. This action cannot be undone.`}
                    </DialogContentText>
                  </DialogContent>

                  <DialogActions>
                    <Button
                      disabled={cancelling}
                      onClick={() => setOpen(false)}
                    >
                      No
                    </Button>
                    <Button
                      onClick={() => {
                        setCancelling(true);
                        cancel()
                          .then((resp) => {
                            console.log(resp);
                            setOpen(false);
                            navigate("/account/bookings");
                          })
                          .finally(() => {
                            setCancelling(false);
                          });
                      }}
                      disabled={cancelling}
                    >
                      {cancelling ? (
                        <>
                          <CircularProgress size={20} sx={{ mr: 1 }} />
                          Cancelling...
                        </>
                      ) : (
                        `Yes`
                      )}
                    </Button>
                  </DialogActions>
                </Dialog>
              </Box>
            </Box>
          </Stack>
        </Paper>
      </Container>
    ),
    [booking, cancel, cancelling, open, navigate]
  );

  return (
    <DataRenderer
      loading={loading}
      error={error}
      normalContent={renderContent}
    />
  );
}
