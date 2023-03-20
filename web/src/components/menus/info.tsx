import clsx from 'clsx';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { GameConfig } from '../../types/game';

interface InfoMenuProps {
  isConnected: boolean;
  config: GameConfig;
}

function InfoMenu(props: InfoMenuProps) {
  const { isConnected, config } = props;

  return (
    <div className='dropdown'>
      <AiOutlineInfoCircle tabIndex={0} className='cursor-pointer' size={25} />
      <div
        tabIndex={0}
        className='dropdown-content mt-2 w-48 rounded bg-gray-100 p-2'
      >
        <div className='p-2'>
          <div className='flex justify-between'>
            <b>Status</b>
            <div
              className={clsx(
                isConnected && 'badge-success',
                !isConnected && 'badge-error',
                'badge-outline badge ml-2'
              )}
            >
              {isConnected ? 'online' : 'offline'}
            </div>
          </div>
          <p className='flex justify-between'>
            <b>Name</b> <span className='ml-2'>{config.name}</span>
          </p>
          <p className='flex justify-between'>
            <b>Room</b> <span className='ml-2'>{config.room}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default InfoMenu;
