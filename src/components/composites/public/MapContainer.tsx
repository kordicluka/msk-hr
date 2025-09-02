"use client";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";
import { contactData } from "@/data/contactData";
const MapContainer = () => {
  // 45.820451448445624, 16.002915194877357
  const position = {
    lat: contactData.latitude,
    lng: contactData.longitude,
  };

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error("Google Maps API key not found");
    return <div>Map unavailable</div>;
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div className="w-full h-full">
        <Map mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID} center={position} zoom={15}>
          <AdvancedMarker position={position}>
            <Pin />
          </AdvancedMarker>
        </Map>
      </div>
    </APIProvider>
  );
};

export default MapContainer;
