import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 49.791392073968595,
  lng: 18.168923342028556,
};

// Lokace jednotlivých hřišť
const locations = [
  { name: "Hala", lat: 49.791392073968595, lng: 18.168923342028556 },
  { name: "Hřiště fotb.1", lat: 49.79172636074341, lng: 18.171738953145276 },
  { name: "Hřiště fotb.2", lat: 49.79189172331498, lng: 18.17200583292588 },
  { name: "Hřiště fotb.3", lat: 49.792339324940166, lng: 18.171461344509847 },
  { name: "Hřiště fotb.4", lat: 49.792567020112564, lng: 18.170997322378742 },
  { name: "Hřiště deln.1", lat: 49.77779199284732, lng: 18.16922298358111 },
  { name: "Hřiště deln.2", lat: 49.77749581201945, lng: 18.16930881426432 },
];

export default function MapCard() {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeMarker, setActiveMarker] = useState<number | null>(null);
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mapa hřišť</CardTitle>
      </CardHeader>
      <CardContent>
        {!mapLoaded ? (
          <button
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded"
            onClick={() => setMapLoaded(true)}
          >
            Načíst mapu
          </button>
        ) : (
          <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              zoom={14}
              center={center}
              onClick={() => setActiveMarker(null)}
            >
              {locations.map((loc, index) => (
                <Marker
                  key={index}
                  position={{ lat: loc.lat, lng: loc.lng }}
                  onClick={() => setActiveMarker(index)}
                >
                  {activeMarker === index && (
                    <InfoWindow>
                      <div className="text-black font-semibold">{loc.name}</div>
                    </InfoWindow>
                  )}
                </Marker>
              ))}
            </GoogleMap>
          </LoadScript>
        )}
      </CardContent>
    </Card>
  );
}
