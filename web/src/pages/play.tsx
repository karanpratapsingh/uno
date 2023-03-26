import { useEffect, useMemo, useState } from 'react';
import { RiShareForwardFill } from 'react-icons/ri';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Avatar from '../components/avatar';
import Game from '../components/game';
import Header from '../components/header';
import Loader from '../components/loader';
import { defaultConfig } from '../config/game';
import { WEB_HTTP_URL } from '../config/web';
import socket from '../lib/socket';
import { validateGameConfig } from '../lib/state';
import { Events, GameConfig, Player } from '../types/game';
import { Routes } from '../types/routes';
import { GameNotifyResponse, GameRoomResponse } from '../types/ws';

function Play(): React.ReactElement {
  const navigate = useNavigate();
  const { state } = useLocation();
  const isValidState = state && validateGameConfig(state);

  useEffect(() => {
    if (!isValidState) {
      navigate(Routes.Home);
      toast.warn('no active game found, please host or join a game');
    }
  }, [isValidState]);

  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
  const [started, setStarted] = useState<boolean>(false);

  const [players, setPlayers] = useState<Player[]>([]);
  const config = useMemo<GameConfig>(
    () => ({
      action: state?.action || defaultConfig.action,
      name: state?.name || defaultConfig.name,
      room: state?.room || defaultConfig.room,
      hand_size: state?.hand_size || defaultConfig.hand_size,
    }),
    [state]
  );

  useEffect(() => {
    const { name, room } = config;
    if (name !== defaultConfig.name && room !== defaultConfig.room) {
      socket.emit(Events.PLAYER_JOIN, { name, room });
    }
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

    function onGameNotify(data: GameNotifyResponse): void {
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

    function onGameRoom(data: GameRoomResponse): void {
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

  useEffect(() => {
    function onReconnect() {
      const { name, room, hand_size } = config;
      // Re-join on reconnect
      socket.emit(Events.PLAYER_JOIN, { name, room });

      if (started) {
        // Restart the game if game was already started
        socket.emit(Events.GAME_START, { room, hand_size });
      }
    }
    socket.io.on('reconnect', onReconnect);

    return () => {
      socket.io.off('reconnect', onReconnect);
    };
  }, [started, config]);

  function onGameStart(): void {
    const { room, hand_size } = config;
    socket.emit(Events.GAME_START, { room, hand_size });
  }

  function onLeave(): void {
    const { name, room } = config;
    socket.emit(Events.PLAYER_LEAVE, { name, room });
    navigate(Routes.Home);
  }

  async function onCopyLink(): Promise<void> {
    const url = `${WEB_HTTP_URL}?join=${config.room}`;

    if ('clipboard' in navigator) {
      await navigator.clipboard.writeText(url);
      toast.success('copied url to the clipboard');
    } else {
      toast.error(`cannot copy to the clipboard, use url ${url}`, {
        draggable: false,
        closeOnClick: false,
      });
    }
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
    let status = 'Waiting for more players to the join...';

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
        <span className='my-6 text-xl italic text-gray-500'>{status}</span>
        <button onClick={onGameStart} className='btn-wide btn mt-2 mb-4'>
          Start
        </button>
        <button onClick={onCopyLink} className='btn-wide btn-ghost btn text-sm'>
          <RiShareForwardFill className='mr-2' />
          copy link
        </button>
      </div>
    );
  }

  return (
    <div className='flex h-full w-full flex-col'>
      <Header
        socket={socket}
        isConnected={isConnected}
        onLeave={onLeave}
        config={config}
      />
      {isConnected ? content : <Loader label='Connecting...' />}
    </div>
  );
}

export default Play;
