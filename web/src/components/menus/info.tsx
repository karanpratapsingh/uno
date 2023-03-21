import clsx from 'clsx';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { RiShareForwardFill } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { WEB_HTTP_URL } from '../../config';
import { GameConfig } from '../../types/game';

interface InfoMenuProps {
  isConnected: boolean;
  config: GameConfig;
}

function InfoMenu(props: InfoMenuProps): React.ReactElement {
  const { isConnected, config } = props;

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
                'badge-outline badge ml-2'
              )}
            >
              {isConnected ? 'online' : 'offline'}
            </div>
          </div>
          <p className='flex justify-between'>
            <b>player</b> <span className='ml-2'>{config.name}</span>
          </p>
          <p className='flex justify-between'>
            <b>room</b> <span className='ml-2'>{config.room}</span>
          </p>
          <p className='mt-4 flex justify-between'>
            <button
              onClick={onCopyLink}
              className='btn-outline btn-ghost btn-block btn-sm btn text-sm'
            >
              <RiShareForwardFill className='mr-2' />
              copy link
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default InfoMenu;
