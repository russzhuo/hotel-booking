import Image from "./Image";
import { useState } from "react";
import {
  Box,
  Button,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  Modal,
  IconButton,
  Slide,
} from "@mui/material";
import { Masonry } from "@mui/lab";
import {
  Apps as AppsIcon,
  ArrowBackIosNew as ArrowBackIosNewIcon,
} from "@mui/icons-material";
import { MAX_CONTENT_WIDTH, MAX_CONTENT_WIDTH_PX } from "../constants/layout";

export default function PlaceGallery({ place }) {
  const [visible, setVisible] = useState(false);

  const placeCover = place.photoUrls[0];

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const modalContent = (() => {
    return (
      <Box
        sx={{
          bgcolor: `white`,
          w: 1,
          height: "100%",
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            p: 2.5,
            pb: 0,
            position: `sticky`,
            top: 0,
          }}
        >
          <IconButton onClick={() => setVisible(false)}>
            <ArrowBackIosNewIcon />
          </IconButton>
        </Box>

        <Box sx={{ maxWidth: MAX_CONTENT_WIDTH, mx: `auto` }}>
          <Typography sx={{ pb: 2 }} variant="h5">
            Photo Gallery
          </Typography>

          <Masonry
            columns={{
              sm: 1,
              md: 2,
            }}
            spacing={2}
          >
            {place.photoUrls.map((url, index) => (
              <Box key={`${url}-${index}`}>
                <Image src={url} alt={url} />
              </Box>
            ))}
          </Masonry>
        </Box>
      </Box>
    );
  })();

  return (
    <>
      <Stack
        direction={isMobile ? "column" : "row"}
        spacing={2}
        sx={{ height: { md: 480, xs: 780 } }}
      >
        <Box
          sx={{
            width: { md: 1 / 2, xs: 1 },
            height: 1,
            position: "relative",
          }}
        >
          <Image
            onClick={() => setVisible(true)}
            className={`${
              isMobile ? "" : "rounded-tl-2xl rounded-bl-2xl "
            }cursor-pointer w-full h-full hover:brightness-[86%] overflow-hidden object-cover `}
            src={placeCover}
            alt="Place Cover"
          />
          <Button
            startIcon={<AppsIcon />}
            sx={{
              px: 2,
              bgcolor: "white",
              borderRadius: 1,
              position: "absolute",
              bottom: 16,
              right: 16,
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "grey.100",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                transform: "translateY(-2px)",
              },
            }}
            onClick={() => {
              setVisible(true);
            }}
          >
            <Typography
              sx={{
                textTransform: "none",
                fontWeight: "bold",
              }}
            >
              See all photos
            </Typography>
          </Button>
        </Box>

        <Box
          sx={{
            width: { md: 1 / 2, xs: 1 },
            height: 1,
          }}
        >
          <Grid
            container
            spacing={2}
            sx={{
              height: 1,
            }}
          >
            {place.photoUrls.slice(1, 5).map((url, idx) => {
              return (
                <Grid key={`${url}-${idx}`} size={6}>
                  <Image
                    onClick={() => setVisible(true)}
                    className={`cursor-pointer w-full h-full hover:brightness-[86%] overflow-hidden object-cover${
                      !isMobile && idx === 1 ? " rounded-tr-2xl" : ""
                    } ${!isMobile && idx === 3 ? " rounded-br-2xl" : ""} ${
                      !isMobile &&
                      idx === 1 &&
                      place.photoUrls.length === 3 &&
                      `rounded-r-2xl`
                    }`}
                    src={url}
                    alt={url}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Stack>

      <Modal open={visible} closeAfterTransition>
        <Slide direction="up" in={visible} timeout={400}>
          {modalContent}
        </Slide>
      </Modal>
    </>
  );
}
