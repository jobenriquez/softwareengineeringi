import { createContext, useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext";
import io from 'socket.io-client';

export const SocketContext = createContext();

export const useSocketContext = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const {authUser} = useAuthContext();

    useEffect(() => {
        if (authUser) {
            const socket = io("http://localhost:5000/", {
                query: {
                    userId: authUser._id
                }
            });

            setSocket(socket);

            // socket.on() is used to listen to the events, and can be used both on client and server side
            socket.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
            });

            return () => socket.close();
        }   else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [authUser]);


    return <SocketContextProvider value = {{socket, onlineUsers}}>{children}</SocketContextProvider>;
};