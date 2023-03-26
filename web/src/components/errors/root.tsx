import { VscError } from 'react-icons/vsc';
import { Link, useRouteError } from 'react-router-dom';
import { Routes } from '../../types/routes';

function RootErrorBoundary(): React.ReactElement {
  const error = useRouteError() as Error;

  return (
    <div className='flex flex-1 flex-col items-center justify-center'>
      <VscError className='text-red-500' size={120} />
      <span className='text-4xl mt-4'>Error</span>
      <span className='text-gray-500 mt-2'>{error?.message}</span>
      <Link to={Routes.Home} className='btn mt-4'>
        Reload
      </Link>
    </div>
  );
}

export default RootErrorBoundary;
