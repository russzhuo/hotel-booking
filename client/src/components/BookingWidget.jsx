import { useContext, useEffect, useMemo, useState } from "react";
import "./BookingWidget.css";
import { UserContext } from "../UserContext";
import { createBooking } from "../data/bookings";
import { toast } from "react-toastify";
import Paper from "@mui/material/Paper";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

function calcDateDiffInDays(checkIn, checkOut) {
  const a = new Date(checkIn);
  const b = new Date(checkOut);

  const _MS_PER_DAY = 1000 * 60 * 60 * 24;

  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

const FeeRow = ({ label, amount }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
    <Typography variant="body1">{label}</Typography>
    <Typography variant="body1">${amount} HKD</Typography>
  </Box>
);

21273939;

export default function BookingWidget({ place }) {
  const { user } = useContext(UserContext);

  const today = useMemo(() => dayjs().startOf("day"), []);
  const tomorrow = useMemo(() => today.add(1, "day"), [today]);

  const maxGuests = place.maxGuests;
  const minGuests = 1;

  const [guests, setGuests] = useState(minGuests);

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);

  let cleaningFee = 0;
  let ServiceFee = 0;
  let placeCharge = 0;
  let total = 0.0;
  let numbOfNights = 0;

  if (checkIn && checkOut) {
    numbOfNights = calcDateDiffInDays(checkIn, checkOut);
    placeCharge = place.price * numbOfNights;
    cleaningFee = placeCharge * 0.12;
    ServiceFee = placeCharge * 0.05;
    total = placeCharge + cleaningFee + ServiceFee;
  }

  // Error states
  const [checkInError, setCheckInError] = useState("");
  const [checkOutError, setCheckOutError] = useState("");

  useEffect(() => {
    const validateCheckIn = () => {
      if (!checkIn) {
        setCheckInError("Check-in date is required");
        return;
      }

      if (checkIn && checkOut && checkIn.isAfter(checkOut)) {
        setCheckInError("Check-in must be before check-out");
        return;
      }

      setCheckInError("");
    };

    const validateCheckOut = () => {
      if (!checkOut) {
        setCheckOutError("Check-out date is required");
        return;
      }

      if (checkIn && checkOut && checkOut.isBefore(checkIn)) {
        setCheckOutError("Check-out must be after check-in");
        return;
      }

      setCheckOutError("");
    };

    validateCheckIn();
    validateCheckOut();
  }, [checkIn, checkOut, guests, maxGuests]);

  const handleBookingSubmit = async (ev) => {
    ev.preventDefault();

    console.log(user);

    if (checkInError || checkOutError) {
      return;
    }

    const bookingData = {
      placeId: place.id,
      user: user.id,
      checkIn,
      checkOut,
      numberOfGuests: guests,
      price: total,
    };

    createBooking(bookingData)
      .then(() => {
        toast.success("Your booking has been placed!");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to process this booking");
      });
  };

  const handleCheckInChange = (newValue) => {
    setCheckIn(newValue);
  };

  const handleCheckOutChange = (newValue) => {
    setCheckOut(newValue);
  };

  const handleGuestsChange = (evt) => {
    let value = evt.target.value;

    if (value < 1) value = 1;
    if (value > maxGuests) value = maxGuests;

    setGuests(value);
  };

  return (
    <Paper
      noValidate
      component={"form"}
      onSubmit={handleBookingSubmit}
      elevation={4}
      sx={{
        p: 4,
        borderRadius: 3,
        position: "sticky",
        top: { xs: "8dvh", sm: "24px" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <DatePicker
          label="check-in"
          value={checkIn}
          disablePast
          minDate={today}
          slotProps={{
            textField: {
              error: Boolean(checkInError),
              helperText: checkInError,
            },
          }}
          onChange={handleCheckInChange}
        />

        <DatePicker
          label="check-out"
          value={checkOut}
          disablePast
          minDate={tomorrow}
          slotProps={{
            textField: {
              error: Boolean(checkOutError),
              helperText: checkOutError,
            },
          }}
          onChange={handleCheckOutChange}
        />

        <TextField
          type="number"
          label="Guests"
          value={guests}
          onChange={handleGuestsChange}
          helperText={`Enter value between ${minGuests} and ${maxGuests}`}
          slotProps={{
            htmlInput: {
              min: minGuests,
              max: maxGuests,
            },
          }}
        />

        {/* "You won't be charged yet" */}
        <Typography variant="body1" color="text.secondary" gutterBottom>
          You won't be charged yet
        </Typography>

        {/* Price Details */}
        <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
          <FeeRow
            label={`${place.price} HKD × ${numbOfNights} nights`}
            amount={placeCharge.toFixed(2)}
          />
          <FeeRow label={`Cleaning fee`} amount={cleaningFee.toFixed(2)} />
          <FeeRow label={`Service fee`} amount={ServiceFee.toFixed(2)} />
        </Box>

        <Divider />

        {/* Total */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight="bold">
            Total before Taxes
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            ${total.toFixed(2)} HKD
          </Typography>
        </Box>

        <Button
          type="submit"
          variant="contained"
          disabled={checkInError || checkOutError}
        >
          Book this place
        </Button>
      </Box>
    </Paper>
  );
}
