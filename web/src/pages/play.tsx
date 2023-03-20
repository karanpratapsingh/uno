import { useEffect, useMemo, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';
import Game from '../components/game';
import Header from '../components/header';
import socket from '../lib/socket';
import { Routes } from '../types/routes';

import { toast } from 'react-toastify';
import { Events, GameAction, GameConfig, Player } from '../types/game';
import { defaultHandSize, validateGameConfig } from '../lib/state';
import Avatar from '../components/avatar';

function Play() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const isValidState = state && validateGameConfig(state);

  useEffect(() => {
    if (!isValidState) {
      navigate(Routes.Home);
      toast.warn('No active game found, please host or join a game');
    }
  }, [isValidState]);

  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
  const [started, setStarted] = useState<boolean>(false);

  const [players, setPlayers] = useState<Player[]>([]);
  const config = useMemo<GameConfig>(
    () => ({
      action: state?.action || GameAction.Join,
      name: state?.name || '',
      room: state?.room || '',
      hand_size: state?.hand_size || defaultHandSize,
    }),
    [state]
  );

  useEffect(() => {
    const { name, room } = config;
    socket.emit(Events.PLAYER_JOIN, { name, room });
  }, [config]);

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on(Events.GAME_NOTIFY, data => {
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

    socket.on(Events.GAME_ROOM, data => {
      setPlayers(data.players);
    });

    socket.on(Events.GAME_START, () => {
      setStarted(true);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('game::notify');
      socket.off('game::room');
      socket.off('game::start');
    };
  }, []);

  function onNewGame() {
    const { room, hand_size } = config;
    socket.emit(Events.GAME_START, { room, hand_size });
  }

  function onLeave() {
    const { name, room } = config;
    socket.emit(Events.PLAYER_LEAVE, { name, room });
    navigate(Routes.Home);
  }

  let content: React.ReactNode = null;
  const currentPlayer = players.find(player => player.name == config.name);

  if (started && currentPlayer) {
    content = (
      <Game
        players={players}
        socket={socket}
        started={started}
        room={config.room}
        currentPlayer={currentPlayer}
      />
    );
  } else {
    let status = 'Waiting for other players to the join...';

    if (players.length > 1) {
      status = 'Waiting for the game to start...';
    }

    content = (
      <div className='flex flex-1 flex-col items-center justify-center'>
        <div className='flex'>
          {players.map((player: Player) => (
            <Avatar key={player.id} name={player.name} />
          ))}
        </div>
        <span className='mt-8 text-xl italic text-gray-500'>{status}</span>
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
        config={config}
      />
      {isConnected ? (
        content
      ) : (
        <div className='flex flex-1 flex-col items-center justify-center'>
          <div className='loader' />
          <span className='mt-8 text-center text-xl italic text-gray-500'>
            connecting...
          </span>
        </div>
      )}
    </div>
  );
}

export default Play;
