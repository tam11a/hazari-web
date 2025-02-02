"use client";

import { io } from "socket.io-client";

export const socket = io(process.env.NEXT_PUBLIC_API_URL as string, {
  autoConnect: true,
  reconnection: true,
  // reconnectionAttempts: Infinity,
  //   path: "/",
  extraHeaders: {
    user_id: 'localStorage.getItem("user_id")',
    username: 'localStorage.getItem("username")',
    table_id: "room_id",
  },
});
