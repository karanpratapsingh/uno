import { Socket } from 'socket.io-client';
import { GameConfig } from '../types/game';
import InfoMenu from './menus/info';

interface HeaderProps {
  socket: Socket;
  isConnected: boolean;
  config: GameConfig;
  onNewGame(): void;
  onLeave(): void;
}

function Header(props: HeaderProps) {
  const { isConnected, onNewGame, config, onLeave } = props;

  return (
    <div className='navbar bg-base-100'>
      <div className='navbar-start'>
        <InfoMenu config={config} isConnected={isConnected} />
      </div>
      <div className='navbar-center hidden lg:flex'>
        <span className='text-2xl font-bold'>UNO</span>
      </div>
      <div className='navbar-end'>
        <button onClick={onNewGame} className='btn-sm btn mr-2'>
          New Game
        </button>
        <button className='btn-ghost btn-sm btn text-red-400' onClick={onLeave}>
          Leave
        </button>
      </div>
    </div>
  );
}

export default Header;
