import { useEffect } from 'react';
import Confetti from 'react-confetti';
import { useLocation, useNavigate } from 'react-router-dom';
import { Routes } from '../types/routes';

function Won(): React.ReactElement {
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state || !('winner' in state)) {
      navigate(Routes.Home);
    }
  }, [state]);

  function onPlayAgain(): void {
    navigate(Routes.Home);
  }

  return (
    <div className='flex h-full w-full flex-col items-center justify-center'>
      <Confetti />
      <p className='text-6xl mb-8'>{state?.winner} won! 🎉</p>
      <button onClick={onPlayAgain} className='btn mt-8'>
        Play again
      </button>
    </div>
  );
}

export default Won;
