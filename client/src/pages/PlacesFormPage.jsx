import AccountNav from "../components/AccountNav";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import PhotosUploader from "../components/PhotosUploader";
import PerkSelector from "../components/PerkSelector";
import { createPlace, usePlaceDetails } from "../data/places";
import { produce } from "immer";

import {
  Container,
  Typography,
  TextField,
  Box,
  Grid,
  Paper,
  InputAdornment,
  FormHelperText,
} from "@mui/material";
import ActionButton from "../components/ActionButton";
import { AttachMoney } from "@mui/icons-material";
import { toast } from "react-toastify";

const formatLocalTime = (time24) => {
  if (!time24) return "";
  const [h, m] = time24.split(":");
  const date = new Date();
  date.setHours(parseInt(h), parseInt(m), 0);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export default function PlacesFormPage() {
  const { id } = useParams();

  const {
    data: placeDetails,
    isLoading,
    error,
    update: updatePlace,
  } = usePlaceDetails(id);

  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [price, setPrice] = useState(100);
  const [redirect, setRedirect] = useState(false);

  const [errors, setErrors] = useState({
    title: "",
    address: "",
    addedPhotos: "",
    description: "",
    perks: "",
    checkIn: "",
    checkOut: "",
    maxGuests: "",
    price: "",
  });

  useEffect(() => {
    if (!id || isLoading || error || !placeDetails) return;

    setTitle(placeDetails.title || "");
    setAddress(placeDetails.address || "");
    setAddedPhotos(placeDetails.photoUrls || []);
    setDescription(placeDetails.description || "");
    setPerks(placeDetails.perks?.map((p) => p.toLowerCase()) || []);
    setExtraInfo(placeDetails.extraInfo || "");
    setCheckIn(formatLocalTime(placeDetails.checkIn) || "");
    setCheckOut(formatLocalTime(placeDetails.checkOut) || "");
    setMaxGuests(placeDetails.maxGuests || 1);
    setPrice(placeDetails.price || 100);
  }, [placeDetails, isLoading, error, id]);

  useEffect(() => {
    setErrors(
      produce((draft) => {
        const isEmpty = (v) => {
          return v == null || (typeof v.trim === "function" && v.trim() === "");
        };

        draft.title = isEmpty(title) ? "Title is required" : "";

        draft.address = isEmpty(address) ? "Address is required" : "";

        draft.description = isEmpty(description)
          ? "Description is required"
          : "";

        const priceInt = parseInt(price);

        draft.price =
          !Number.isFinite(priceInt) || priceInt < 0
            ? "Price must be greater than 0"
            : "";

        draft.checkIn = /^\d{2}:\d{2}$/.test(checkIn?.trim() || "")
          ? ""
          : "Valid check-in time required (e.g. 14:00)";

        draft.checkOut = /^\d{2}:\d{2}$/.test(checkOut?.trim() || "")
          ? ""
          : "Valid check-out time required (e.g. 11:00)";

        draft.addedPhotos =
          Array.isArray(addedPhotos) && addedPhotos.length > 0
            ? ""
            : "At least one photo is required";

        draft.perks =
          Array.isArray(perks) && perks.length > 0
            ? ""
            : "Select at least one perk";

        const maxGuestsInt = parseInt(maxGuests);
        draft.maxGuests =
          Number.isInteger(parseInt(maxGuestsInt)) &&
          parseInt(maxGuestsInt) >= 1
            ? ""
            : "Must be a number ≥ 1";
      })
    );
  }, [
    title,
    address,
    addedPhotos,
    description,
    perks,
    checkIn,
    checkOut,
    maxGuests,
    price,
    setErrors,
  ]);

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    const placeData = {
      title,
      address,
      photoUrls: addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests: Number(maxGuests),
      price: Number(price),
    };

    try {
      if (id) {
        await updatePlace(placeData);
        toast.success('Place updated successfully!');
      } else {
        await createPlace(placeData);
        setRedirect(true);
      }
    } catch (err) {
      console.error("Failed to save place:", err);
    }
  };

  if (redirect) {
    return <Navigate to="/account/places" replace />;
  }

  const sectionTitle = (text) => (
    <Typography variant="h6" gutterBottom sx={{ mt: 4, fontWeight: 600 }}>
      {text}
    </Typography>
  );

  const sectionDescription = (text) => (
    <Typography variant="body2" color="text.secondary" gutterBottom>
      {text}
    </Typography>
  );

  return (
    <Container maxWidth="md">
      <AccountNav />

      <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, mt: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {id ? "Edit Place" : "Add New Place"}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          {sectionTitle("Title")}
          {sectionDescription(
            "Title for your place. Should be short and catchy as in advertisement."
          )}
          <TextField
            fullWidth
            variant="outlined"
            placeholder="e.g., My lovely apartment"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 3 }}
            error={!!errors.title}
            helperText={errors.title}
          />

          {sectionTitle("Address")}
          {sectionDescription("Address to this place")}
          <TextField
            fullWidth
            variant="outlined"
            placeholder="123 Main St, City, Country"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            sx={{ mb: 3 }}
            error={!!errors.address}
            helperText={errors.address}
          />

          {sectionTitle("Photos")}
          {sectionDescription("The more photos, the better!")}
          <Box
            sx={{
              mb: 3,
              display: "inline-flex",
              verticalAlign: "top",
              flexDirection: "column",
              width: 1,
            }}
          >
            <PhotosUploader
              addedPhotos={addedPhotos}
              setAddedPhotos={setAddedPhotos}
            />
            {!!errors.addedPhotos && (
              <FormHelperText
                className="Mui-error"
                sx={{
                  mx: 1.75,
                }}
              >
                {errors.addedPhotos}
              </FormHelperText>
            )}
          </Box>

          {sectionTitle("Description")}
          {sectionDescription("Description of the place")}
          <TextField
            fullWidth
            multiline
            rows={5}
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 3 }}
            error={!!errors.description}
            helperText={errors.description}
          />

          {sectionTitle("Perks")}
          {sectionDescription("Select all the perks your place offers")}
          <Box
            sx={{
              mb: 3,
              display: "inline-flex",
              verticalAlign: "top",
              flexDirection: "column",
              width: 1,
            }}
          >
            <PerkSelector
              selected={perks}
              onChange={(ps) => setPerks(ps.map((p) => p.toLowerCase()))}
            />
            {!!errors.perks && (
              <FormHelperText
                className="Mui-error"
                sx={{
                  mx: 1.75,
                  mb: 3,
                }}
              >
                {errors.perks}
              </FormHelperText>
            )}{" "}
          </Box>

          {sectionTitle("Extra Info")}
          {sectionDescription(
            <>
              House rules, policies, etc.{" "}
              <Box component="span" sx={{ fontSize: "0.875rem", opacity: 0.7 }}>
                — optional
              </Box>
            </>
          )}
          <TextField
            fullWidth
            multiline
            rows={5}
            variant="outlined"
            value={extraInfo}
            onChange={(e) => setExtraInfo(e.target.value)}
            sx={{ mb: 3 }}
          />

          {sectionTitle("Check in & out times, guests, and price")}
          {sectionDescription(
            "Add check-in/out times and remember to leave time for cleaning between guests."
          )}

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" gutterBottom>
                Check-in time
              </Typography>
              <TextField
                fullWidth
                placeholder="14:00"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                error={!!errors.checkIn}
                helperText={errors.checkIn}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" gutterBottom>
                Check-out time
              </Typography>
              <TextField
                fullWidth
                placeholder="11:00"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                error={!!errors.checkOut}
                helperText={errors.checkOut}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" gutterBottom>
                Max guests
              </Typography>
              <TextField
                fullWidth
                type="number"
                placeholder="4"
                value={maxGuests}
                onChange={(e) => setMaxGuests(e.target.value)}
                inputProps={{ min: 1 }}
                error={!!errors.maxGuests}
                helperText={errors.maxGuests}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" gutterBottom>
                Price per night
              </Typography>
              <TextField
                fullWidth
                type="number"
                placeholder="100"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoney color="action" />
                    </InputAdornment>
                  ),
                }}
                error={!!errors.price}
                helperText={errors.price}
              />
            </Grid>
          </Grid>

          {/* Submit Button */}
          <ActionButton
            type="submit"
            fullWidth
            sx={{ mx: "auto", borderRadius: 1 }}
            disabled={Object.values(errors).some((v) => v)}
          >
            Save
          </ActionButton>
        </Box>
      </Paper>
    </Container>
  );
}
