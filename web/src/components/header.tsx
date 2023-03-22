import { Socket } from 'socket.io-client';
import { logoURL } from '../lib/image';
import { GameConfig } from '../types/game';
import InfoMenu from './menus/info';
import ConfirmModal from './modals/confirm';

interface HeaderProps {
  socket: Socket;
  isConnected: boolean;
  config: GameConfig;
  onLeave(): void;
}

function Header(props: HeaderProps): React.ReactElement {
  const { isConnected, config, onLeave } = props;

  return (
    <>
      <div className='navbar'>
        <div className='navbar-start'>
          <InfoMenu config={config} isConnected={isConnected} />
        </div>
        <div className='navbar-center hidden lg:flex'>
          <img className='h-10' src={logoURL} alt='uno logo' />
        </div>
        <div className='navbar-end'>
          <label
            className='btn-ghost btn text-red-400'
            htmlFor='confirm-leave-modal'
          >
            Leave
          </label>
        </div>
      </div>
      <ConfirmModal onConfirm={onLeave} />
    </>
  );
}

export default Header;
