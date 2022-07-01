import React from "react";
import io from "socket.io-client";
const BASE_URL = "https://tashi-chat-app.herokuapp.com/";

export const socket = io(BASE_URL);
export const SocketContext = React.createContext();
