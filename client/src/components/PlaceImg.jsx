import Image from "./Image.jsx";

export default function PlaceImg({ place, index = 0, className = null }) {
  if (!place.photoUrls?.length) {
    return "";
  }
  if (!className) {
    className = "object-cover";
  }

  if (place.photoUrls[index] == null) {
    console.log("place.photoUrls: ", place.photoUrls);
    console.log("index: ", index);
  }
  return <Image className={className} src={place.photoUrls[index]} alt="" />;
}
