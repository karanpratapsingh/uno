import { useEffect, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';
import Game from '../components/game';
import Header from '../components/header';
import socket from '../lib/socket';
import { Routes } from '../types/routes';

function Play() {
  const { state } = useLocation();

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [started, setStarted] = useState(false);

  const [players, setPlayers] = useState([]);
  const [config, setConfig] = useState({
    name: state.name,
    room: state.room,
    hand_size: 4,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const { name, room } = config;
    socket.emit('join', { name, room });
  }, [config]);

  useEffect(() => {
    function onConnect(): void {
      setIsConnected(true);
    }

    function onDisconnect(): void {
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    function onRoom(data: any): void {
      setPlayers(data.players);
    }

    socket.on('room', onRoom);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('room', onRoom);
    };
  }, []);

  function onNewGame() {
    const { hand_size } = config;
    socket.emit('new-game', { hand_size });
    setStarted(true);
  }

  function onLeave() {
    const { name, room } = config;
    socket.emit('leave', { name, room });
    navigate(Routes.Home);
  }

  let content: React.ReactNode = null;

  if (started) {
    content = <Game socket={socket} />;
  } else {
    console.log(players);
    let status = 'Waiting for second player to the join...';

    if (players.length > 1) {
      status = 'Waiting for the game to start...';
    }

    content = (
      <div className='flex flex-1 flex-col items-center justify-center'>
        <div>
          {players.map((player: any) => (
            <div className='placeholder avatar mr-4'>
              <div className='w-24 rounded-full bg-neutral-focus text-neutral-content'>
                <span className='text-3xl'>{player.name}</span>
              </div>
            </div>
          ))}
        </div>
        <span className='mt-8 text-xl italic'>{status}</span>
      </div>
    );
  }

  return (
    <div className='flex h-full w-full flex-col p-4'>
      <Header
        socket={socket}
        isConnected={isConnected}
        onNewGame={onNewGame}
        onLeave={onLeave}
        {...config}
      />
      {isConnected ? (
        content
      ) : (
        <div className='flex flex-1 items-center justify-center'>
          <div className='loader' />
        </div>
      )}
    </div>
  );
}

export default Play;
