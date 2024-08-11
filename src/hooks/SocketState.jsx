import React, { createContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();

export const SocketState = ({ children }) => {
    const [location, setLocation] = useState([]);

    const socket = useMemo(() => io("https://real-time-tracker-backend.onrender.com/"), []);

    useEffect(() => {
        socket.on("connect", () => {
            alert(`User connected with ${socket.id}`);
        });

        // Clean up the socket connection when the component unmounts
        return () => {
            socket.disconnect();
        };
    }, [socket]);

    useEffect(() => {
        socket.on("recive-location", (data) => {
            const updateLocation = [...location, {
                id: data.id,
                coordinates: { lat: data.latitude, lng: data.longitude },
            }];


            setLocation(updateLocation);
        });

        socket.on("leave", (data) => {
            console.log(`user disconnect with user id ${data.id}`)
          const updateLocation =  location.filter(obj => obj.id !== data.id);
          setLocation(updateLocation)
        })

        return () => {
            socket.off("recive-location");
        };
    }, [location, socket]);

    return (
        <SocketContext.Provider value={{ location, setLocation, socket }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketState;
