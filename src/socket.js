// socket.js
import { io } from 'socket.io-client';
export const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001', {
  transports: ['websocket', 'polling'],
  withCredentials: true,
});
