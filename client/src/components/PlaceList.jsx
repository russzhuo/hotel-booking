import CardMedia from "@mui/material/CardMedia";
import PlaceImg from "./PlaceImg";
import CardActionArea from "@mui/material/CardActionArea";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import { Link } from "react-router-dom";

const PlaceList = ({ places }) => {
  return places && places.length > 0 ? (
    <Grid container spacing={3} sx={{ mt: 2 }}>
      {places.map((place) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={place.id}>
          <Card
            elevation={2}
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 6,
              },
            }}
          >
            <CardActionArea
              component={Link}
              to={`/account/places/${place.id}`}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
              }}
            >
              <CardMedia
                sx={{
                  height: 200,
                  position: "relative",
                  overflow: "hidden",
                  bgcolor: "grey.200",
                }}
              >
                <PlaceImg place={place} index={0} />
              </CardMedia>

              <CardContent sx={{ flexGrow: 1, pb: 3 }}>
                <Typography variant="h6" component="h2" gutterBottom noWrap>
                  {place.title}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {place.description || "No description available."}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  ) : (
    // Optional: empty state (reuse from earlier)
    <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
      <Typography variant="h6">No places added yet</Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        Start by adding your first place!
      </Typography>
    </Box>
  );
};

export default PlaceList;
