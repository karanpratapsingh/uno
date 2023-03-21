import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import StartModal from '../components/modals/start';
import { roomExists } from '../lib/api';
import { getAssetURL } from '../lib/image';
import { GameAction, GameConfig } from '../types/game';
import { Routes } from '../types/routes';

const logoURL = getAssetURL('../assets/images/logo.svg');

function Home(): React.ReactElement {
  const navigate = useNavigate();

  async function onStart(
    action: GameAction,
    name: string,
    room: string,
    hand_size: number
  ) {
    if (action === GameAction.Join) {
      const exists = await roomExists(room);
      if (!exists) {
        toast.error(`room ${room} does not exist`);
        return;
      }
    }

    navigate(Routes.Play, {
      state: { action, name, room, hand_size } as GameConfig,
    });
  }

  return (
    <div className='flex h-full w-full flex-col items-center justify-center p-4'>
      <img className='h-48' src={logoURL} alt='uno logo' />
      <div className='mt-10 flex flex-col'>
        <label
          htmlFor={`${GameAction.Host}-modal`}
          className='btn-wide btn mb-4'
        >
          Host
        </label>
        <label
          htmlFor={`${GameAction.Join}-modal`}
          className='btn-outline btn-ghost btn-wide btn'
        >
          Join
        </label>
      </div>

      <StartModal action={GameAction.Host} onStart={onStart} />
      <StartModal action={GameAction.Join} onStart={onStart} />
    </div>
  );
}

export default Home;
