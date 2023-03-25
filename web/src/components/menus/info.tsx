import clsx from 'clsx';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { version } from '../../../package.json';
import { GameConfig } from '../../types/game';

interface InfoMenuProps {
  isConnected: boolean;
  config: GameConfig;
}

function InfoMenu(props: InfoMenuProps): React.ReactElement {
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
            <b>status</b>
            <div
              className={clsx(
                isConnected && 'badge-success',
                !isConnected && 'badge-error',
                'badge-outline badge'
              )}
            >
              {isConnected ? 'online' : 'offline'}
            </div>
          </div>
          <p className='flex justify-between'>
            <b>player</b> <span>{config.name}</span>
          </p>
          <p className='flex justify-between'>
            <b>room</b> <span>{config.room}</span>
          </p>
          <p className='flex justify-between'>
            <b>version</b> <span>{version}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default InfoMenu;
