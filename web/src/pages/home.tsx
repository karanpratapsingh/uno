import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Footer from '../components/footer';
import StartModal from '../components/modals/start';
import { allowPlayer } from '../lib/api';
import { logoURL } from '../lib/image';
import { maxHandSize, minHandSize } from '../lib/state';
import { GameAction, GameConfig } from '../types/game';
import { Routes } from '../types/routes';

function Home(): React.ReactElement {
  const navigate = useNavigate();

  async function onStart(
    action: GameAction,
    name: string,
    room: string,
    hand_size: number
  ): Promise<void> {
    try {
      const { allow, reason } = await allowPlayer(action, name, room);
      if (!allow) {
        toast.error(reason);
        return;
      }

      if (action === GameAction.Host) {
        if (hand_size > maxHandSize) {
          toast.error(`hand size should not be greater than ${maxHandSize}`);
          return;
        }

        if (hand_size < minHandSize) {
          toast.error(`hand size should not be less than ${minHandSize}`);
          return;
        }
      }

      navigate(Routes.Play, {
        state: { action, name, room, hand_size } satisfies GameConfig,
      });
    } catch (error) {
      console.error(error);
      toast.error('encountered error while joining the game');
    }
  }

  return (
    <div className='flex flex-1 flex-col px-6 py-4'>
      <div className='flex flex-1 flex-col items-center justify-center'>
        <img className='h-40 lg:h-44' src={logoURL} alt='uno logo' />
        <div className='mt-16 flex flex-col'>
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
      </div>
      <StartModal action={GameAction.Host} onStart={onStart} />
      <StartModal action={GameAction.Join} onStart={onStart} />
      <Footer />
    </div>
  );
}

export default Home;
