import { Socket } from 'socket.io-client';
import { getAssetURL } from '../lib/image';
import { GameConfig } from '../types/game';
import InfoMenu from './menus/info';

interface HeaderProps {
  socket: Socket;
  isConnected: boolean;
  config: GameConfig;
  onLeave(): void;
}

const logoURL = getAssetURL('../assets/images/logo.svg');

function Header(props: HeaderProps): React.ReactElement {
  const { isConnected, config, onLeave } = props;

  return (
    <div className='navbar'>
      <div className='navbar-start'>
        <InfoMenu config={config} isConnected={isConnected} />
      </div>
      <div className='navbar-center hidden lg:flex'>
        <img className='h-10' src={logoURL} alt='uno logo' />
      </div>
      <div className='navbar-end'>
        <button className='btn-ghost btn-sm btn text-red-400' onClick={onLeave}>
          Leave
        </button>
      </div>
    </div>
  );
}

export default Header;
