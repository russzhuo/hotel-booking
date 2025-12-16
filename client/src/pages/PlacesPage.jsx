import AccountNav from "../components/AccountNav";
import { useCallback, useContext } from "react";

import { register } from "swiper/element/bundle";

register();
// Import Swiper React components

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// import required modules
import { UserContext } from "../UserContext";
import { useUserPlaces } from "../data/places";
import { DataRenderer } from "../components/DataRenderer";
import PlaceList from "../components/PlaceList";
import Box from "@mui/material/Box";
import { Plus } from "lucide-react";
import { Button } from "@mui/material";
import ActionButton from "../components/ActionButton";

const AddNewPlaceLink = () => {
  return (
    <ActionButton to={"/account/places/new"} startIcon={<Plus />}>
      Add new place
    </ActionButton>
  );
};

export default function PlacesPage() {
  const { user } = useContext(UserContext);
  const { data: places, isLoading, error } = useUserPlaces(user?.id);

  const renderContent = useCallback(() => {
    return (
      <Box sx={{ maxWidth: "lg", mx: "auto", mb:4 }}>
        <AccountNav />
        <AddNewPlaceLink />
        <PlaceList places={places} />
      </Box>
    );
  }, [places]);

  return (
    <DataRenderer
      loading={isLoading}
      error={error}
      normalContent={renderContent}
    />
  );
}
