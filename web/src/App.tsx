import { useEffect, useState } from 'react';

import { io, Socket } from 'socket.io-client';

const client = io('localhost:5000/', {
  transports: ['websocket'],
  autoConnect: true,
});

function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const socket = client.connect();
    setSocket(socket);

    socket.on('connect', () => {
      setLoading(false);
    });

    socket.on('disconnect', data => {
      setLoading(true);
    });
  }, []);

  return { socket, loading };
}

function App() {
  const { socket, loading } = useSocket();

  if (loading || !socket) {
    return <span>Loading...</span>;
  }

  
  return (
    <div>
      <p>Connected: {socket.connected ? 'True' : 'False'}</p>
      <button onClick={() => {
        socket.emit('data', { nope: 'yes' })
      }}>Send</button>
    </div>
  );
}

export default App;
