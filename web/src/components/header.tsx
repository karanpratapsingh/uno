import { Socket } from 'socket.io-client';
import { GameConfig } from '../types/game';

interface HeaderProps {
  socket: Socket;
  isConnected: boolean;
  config: GameConfig;
  onNewGame(): void;
  onLeave(): void;
}

function Header(props: HeaderProps) {
  const { isConnected, onNewGame, onLeave } = props;

  return (
    <div className='navbar bg-base-100'>
      <div className='navbar-start'>
        <div>
          {isConnected ? (
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
        <button onClick={onNewGame} className='btn-sm btn mr-2'>
          New Game
        </button>
        <button className='btn-ghost btn-sm btn' onClick={onLeave}>
          Leave
        </button>
      </div>
    </div>
  );
}

export default Header;
