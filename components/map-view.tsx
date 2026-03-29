"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { DEFAULT_ZOOM, JINJA_CENTER } from "@/lib/constants";
import type { Place } from "@/types";

type MapViewProps = {
  places: Place[];
  selectedPlace: Place | null;
  onSelectPlace: (place: Place) => void;
};

function MapRecenter({ selectedPlace }: { selectedPlace: Place | null }) {
  const map = useMap();

  useEffect(() => {
    if (selectedPlace) {
      map.flyTo([selectedPlace.latitude, selectedPlace.longitude], 15, { duration: 0.75 });
    }
  }, [map, selectedPlace]);

  return null;
}

export function MapView({ places, selectedPlace, onSelectPlace }: MapViewProps) {
  useEffect(() => {
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
    });
  }, []);

  return (
    <MapContainer center={JINJA_CENTER} zoom={DEFAULT_ZOOM} scrollWheelZoom className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapRecenter selectedPlace={selectedPlace} />
      {places.map((place) => (
        <Marker
          key={place.id}
          position={[place.latitude, place.longitude]}
          eventHandlers={{
            click: () => onSelectPlace(place)
          }}
        >
          <Popup>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900">{place.name}</p>
              <p className="text-xs text-slate-600">{place.category}</p>
              <p className="text-xs text-slate-500">{place.address}</p>
              <p className="text-xs font-medium text-slate-500">{place.phone}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
