import { useNavigate } from 'react-router-dom';
import StartModal from '../components/modals/start';
import { GameAction } from '../types/game';
import { Routes } from '../types/routes';

function Home() {
  const navigate = useNavigate();

  function onStart(action: GameAction, name: string, room: string) {
    navigate(Routes.Play, { state: { action, name, room } });
  }

  return (
    <div className='flex h-full w-full flex-col items-center justify-center p-4'>
      <div className='flex flex-col'>
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
