import { useCallback } from "react";
import { Link } from "react-router-dom";
import Image from "../components/Image";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./IndexPage.css";
// import required modules
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper/modules";
import { usePlaces } from "../data/places";
import { DataRenderer } from "../components/DataRenderer";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { MAX_CONTENT_WIDTH_PX } from "../constants/layout";

export default function IndexPage() {
  const { data: places = [], isLoading: loading, error } = usePlaces();

  const renderNormalContent = useCallback(() => {
    if (!places?.length) {
      return (
        <Typography textAlign="center" py={8} color="text.secondary">
          No places yet
        </Typography>
      );
    }

    return (
      <div
        className={`mt-4 mx-auto max-w-[${MAX_CONTENT_WIDTH_PX}] gap-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5`}
      >
        {/* onMouseEnter={()=>setIsHovered(index)} onMouseLeave={()=>setIsHovered(-1)} */}
        {places.length > 0 &&
          places.map((place, index) => (
            <Link key={index} to={"/places/" + place.id} className="index-link">
              <Swiper
                style={{
                  "--swiper-navigation-size": "15px",
                }}
                cssMode={true}
                pagination={true}
                // mousewheel={true}
                // keyboard={true}
                modules={[Navigation, Pagination, Mousewheel, Keyboard]}
                // navigation={isHovered===index? true : false}
                navigation={true}
              >
                {place.photoUrls.map((photo, idx) => (
                  <SwiperSlide className="" key={`${photo}-${idx}`}>
                    <Image
                      className="rounded-2xl object-cover aspect-square"
                      src={photo}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              <Box sx={{ p: 2 }}>
                <Typography fontWeight="bold" noWrap>
                  {place.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {place.address}
                </Typography>
                <Typography fontWeight="bold" mt={0.5}>
                  ${place.price} HKD{" "}
                  <span style={{ fontWeight: 400 }}> / night</span>
                </Typography>
              </Box>
            </Link>
          ))}
      </div>
    );
  }, [places]);

  return (
    <DataRenderer
      error={error}
      loading={loading}
      normalContent={renderNormalContent}
    />
  );
}
