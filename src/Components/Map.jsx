import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useContext, useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { SocketContext } from "../hooks/SocketState";

const Map = () => {
  const { location, setLocation, socket } = useContext(SocketContext);
  console.log(location);

  const [centers, setCenters] = useState({
    loaded: false,
    coordinates: { lat: 0, lng: 0 },
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenters({
            loaded: true,
            coordinates: { lat: latitude, lng: longitude },
          });
          socket.emit("send-location", { latitude, longitude });
        },
        (error) => {
          setCenters({
            loaded: true,
            error,
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, [socket]);

  console.log(centers);

  const customIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/684/684908.png",
    iconSize: [38, 38],
  });

  return (
    <>
      {centers.loaded && (
        <MapContainer
          center={[centers.coordinates.lat, centers.coordinates.lng]}
          zoom={26}
          scrollWheelZoom={true}
          style={{
            width: "100vw",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {location.map((local, index) => (
            <Marker
              key={local.id}
              position={[
                local.coordinates.lat + (index * 0.0001), // slight offset
                local.coordinates.lng + (index * 0.0001)  // slight offset
              ]}
              icon={customIcon}
            />
          ))}

        </MapContainer>
      )}
    </>
  );
};

export default Map;
