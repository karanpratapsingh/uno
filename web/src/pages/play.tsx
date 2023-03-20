import { useEffect, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';
import Game from '../components/game';
import Header from '../components/header';
import socket from '../lib/socket';
import { Routes } from '../types/routes';

import { toast } from 'react-toastify';

function Play() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const isValidState = state && 'name' in state && 'room' in state;

  useEffect(() => {
    if (!isValidState) {
      navigate(Routes.Home);
      // TODO: notify
    }
  }, [isValidState]);

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [started, setStarted] = useState(false);

  const [players, setPlayers] = useState([]);
  const [config, setConfig] = useState({
    name: state?.name || '',
    room: state?.room || '',
    hand_size: 4,
  });

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

    socket.on('notify', data => {
      const { type, message } = data;
      switch (type) {
        case 'info':
          toast.info(message);
          break;
        case 'success':
          toast.success(message);
          break;
        case 'warn':
          toast.warn(message);
          break;
        case 'error':
          toast.error(message);
          break;
      }
    });

    socket.on('room', data => {
      setPlayers(data.players);
    });

    socket.on('game::start', () => {
      setStarted(true);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('room');
      socket.off('notify');
    };
  }, []);

  function onNewGame() {
    const { room, hand_size } = config;
    socket.emit('game::init', { room, hand_size });
  }

  function onLeave() {
    const { name, room } = config;
    socket.emit('leave', { name, room });
    navigate(Routes.Home);
  }

  let content: React.ReactNode = null;

  if (started) {
    content = <Game socket={socket} started={started} />;
  } else {
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
