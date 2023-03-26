import { useEffect } from 'react';
import Confetti from 'react-confetti';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Routes } from '../types/routes';

function Won(): React.ReactElement {
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state || !('winner' in state)) {
      navigate(Routes.Home);
    }
  }, [state]);

  return (
    <div className='flex flex-1 flex-col items-center justify-center'>
      <Confetti />
      <p className='text-4xl xl:text-6xl mb-8'>{state?.winner} won! 🎉</p>
      <Link to={Routes.Home} className='btn mt-8'>
        Play again
      </Link>
    </div>
  );
}

export default Won;
