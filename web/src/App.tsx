import { useEffect, useState } from 'react';

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
  const { color, value } = props;

  const cardColor: Record<any, string> = {
    red: 'bg-red-200',
    blue: 'bg-blue-200',
    green: 'bg-green-200',
    yellow: 'bg-yellow-200',
    black: 'bg-gray-800',
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
      className={`mr-4 flex h-40 w-32 items-center justify-center rounded ${cardColor[color]}`}
    >
      <span className='text-4xl'>{cardValue[value]}</span>
    </button>
  );
}

function App() {
  const { socket, loading } = useSocket();
  const [config, setConfig] = useState({ players: 2, hand_size: 7 });
  const [hands, setHands] = useState([]);

  useEffect(() => {
    socket?.on('new-game', data => {
      setHands(data.hands);
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
    const gameStarted = !!hands.length;

    const [player1, player2]: any = hands;

    return (
      <>
        {gameStarted ? (
          <div className='flex flex-1 flex-col justify-center'>
            {/* Player 2 */}
            <div className='flex flex-1 items-center justify-center'>
              {player1.map((card: any) => (
                <Card {...card} />
              ))}
            </div>

            {/* Card space */}
            <div className='flex flex-1 bg-green-100'>CS</div>

            {/* Player 1 */}
            <div className='flex flex-1 items-center justify-center'>
              {player2.map((card: any) => (
                <Card {...card} />
              ))}
            </div>
          </div>
        ) : (
          <div className='flex flex-1 items-center justify-center'>
            <span>Waiting for game to start...</span>
          </div>
        )}
      </>
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
