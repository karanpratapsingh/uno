import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Avatar from '../components/avatar';
import Game from '../components/game';
import Header from '../components/header';
import socket from '../lib/socket';
import { defaultHandSize, validateGameConfig } from '../lib/state';
import {
  Events,
  GameAction,
  GameConfig,
  GameNotifyPaylod,
  GameRoomPaylod,
  Player,
} from '../types/game';
import { Routes } from '../types/routes';

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
    function onConnect(): void {
      setIsConnected(true);
    }
    socket.on('connect', onConnect);

    function onDisconnect(): void {
      setIsConnected(false);
    }
    socket.on('disconnect', onDisconnect);

    function onGameNotify(data: GameNotifyPaylod): void {
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
    }
    socket.on(Events.GAME_NOTIFY, onGameNotify);

    function onGameRoom(data: GameRoomPaylod): void {
      setPlayers(data.players);
    }
    socket.on(Events.GAME_ROOM, onGameRoom);

    function onGameStart(): void {
      setStarted(true);
    }
    socket.on(Events.GAME_START, onGameStart);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off(Events.GAME_NOTIFY, onGameNotify);
      socket.off(Events.GAME_ROOM, onGameRoom);
      socket.off(Events.GAME_START, onGameStart);
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
