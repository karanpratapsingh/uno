import { useEffect, useState } from 'react';
import clsx from 'clsx';

import { io, Socket } from 'socket.io-client';
import {
  RiNumber0,
  RiNumber1,
  RiNumber2,
  RiNumber3,
  RiNumber4,
  RiNumber5,
  RiNumber6,
  RiNumber7,
  RiNumber8,
  RiNumber9,
} from 'react-icons/ri';

import { HiSquares2X2 } from 'react-icons/hi2';

import { AiOutlinePlus, AiOutlineStop, AiOutlineUndo } from 'react-icons/ai';

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

function Card(props: any) {
  const { player, color, value, hidden = false, onClick } = props;

  const cardColor: Record<any, string> = {
    red: 'bg-red-400',
    blue: 'bg-blue-400',
    green: 'bg-green-400',
    yellow: 'bg-yellow-200',
    black: 'bg-gray-700',
  };

  const cardValue: Record<string, React.ReactNode> = {
    '0': <RiNumber0 />,
    '1': <RiNumber1 />,
    '2': <RiNumber2 />,
    '3': <RiNumber3 />,
    '4': <RiNumber4 />,
    '5': <RiNumber5 />,
    '6': <RiNumber6 />,
    '7': <RiNumber7 />,
    '8': <RiNumber8 />,
    '9': <RiNumber9 />,
    '+2': (
      <div className='flex'>
        <AiOutlinePlus />
        <RiNumber2 />
      </div>
    ),
    '+4': (
      <div className='flex'>
        <AiOutlinePlus className='text-white' />
        <RiNumber4 className='text-white' />
      </div>
    ),
    skip: <AiOutlineStop />,
    reverse: <AiOutlineUndo />,
    wild: <HiSquares2X2 className='text-white' />,
  };

  return (
    <button
      onClick={onClick && (() => onClick(player, { color, value }))}
      className={`mr-4 flex h-40 w-32 items-center justify-center rounded ${clsx(
        hidden && 'bg-gray-800',
        !hidden && cardColor[color]
      )}`}
    >
      <span className='text-3xl'>
        {hidden ? <span className='text-white'>UNO</span> : cardValue[value]}
      </span>
    </button>
  );
}

function App() {
  const { socket, loading } = useSocket();
  const [config, setConfig] = useState({ hand_size: 2 });
  const [hands, setHands] = useState(null);
  const [gameStack, setGameStack] = useState<any>([]);
  const [remainingCards, setRemainingCards] = useState<any>([]);

  useEffect(() => {
    socket?.on('state-change', data => {
      console.log(data);
      setHands(data.hands);
      setGameStack(data.game_stack.reverse());
      setRemainingCards(data.remaining_cards);
    });
  }, [socket]);

  function Header() {
    function newGame() {
      socket?.emit('new-game', config);
    }

    return (
      <div className='navbar bg-base-100'>
        <div className='navbar-start'>
          <div>
            {socket?.connected ? (
              <div className='h-4 w-4 rounded bg-green-400' />
            ) : (
              <div className='h-4 w-4 rounded bg-red-400' />
            )}
          </div>
        </div>
        <div className='navbar-center hidden lg:flex'>
          <span className='text-xl font-bold'>UNO</span>
        </div>
        <div className='navbar-end'>
          <button onClick={newGame} className='btn-sm btn'>
            New Game
          </button>
        </div>
      </div>
    );
  }

  function Game() {
    function playCard(player: string, card: any) {
      socket?.emit('play-card', { player, card });
    }

    function drawCard() {
      socket?.emit('draw-card', { player: 'player_2' });
    }

    const gameStarted = hands && !!gameStack.length && !!remainingCards.length;

    if (!gameStarted) {
      return (
        <div className='flex flex-1 items-center justify-center'>
          <span className='text-xl italic'>Waiting for game to start...</span>
        </div>
      );
    }

    const { player_1, player_2 }: any = hands;

    return (
      <div className='flex flex-1 flex-col justify-center'>
        {/* Player 1 */}
        <div className='flex flex-1 items-center'>
          {player_1.map((card: any) => (
            <Card player={'player_1'} {...card} onClick={playCard} />
          ))}
        </div>

        {/* Card space */}
        <div className='flex flex-1 items-center justify-center'>
          <div className='flex flex-1'>
            <div className='stack' onClick={drawCard}>
              {remainingCards.map((card: any) => (
                <Card {...card} hidden={true} />
              ))}
            </div>
          </div>
          <div className='flex flex-1'>
            <div className='stack'>
              {gameStack.map((card: any) => (
                <Card {...card} />
              ))}
            </div>
          </div>
        </div>

        {/* Player 2 */}
        <div className='flex flex-1 items-center'>
          {player_2.map((card: any) => (
            <Card player={'player_2'} {...card} onClick={playCard} />
          ))}
        </div>
      </div>
    );
  }

  const isLoaded = loading || !socket;

  return (
    <div className='flex h-full w-full flex-col p-4'>
      {Header()}
      {isLoaded ? (
        <div className='flex flex-1 items-center justify-center'>
          <div className='loader' />
        </div>
      ) : (
        Game()
      )}
    </div>
  );
}

export default App;
