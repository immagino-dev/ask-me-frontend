import SocketIO from 'socket.io-client'

import store from '~/store';

export default function useSoket(room_id) {
  console.log('Socket constructor');
  const io = SocketIO(import.meta.env.VITE_APP_SOCKET, {
    transports: ['websocket'],
    query: { user: store.getters.getId || Math.random() * 10, room: room_id },
  });

  return io;
}