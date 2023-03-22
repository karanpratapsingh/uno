import { useMemo } from 'react';
import { getBlankCardURL } from '../../lib/image';

interface BlankCardProps {
  hidden?: boolean;
}

function BlankCard(props: BlankCardProps): React.ReactElement {
  const { hidden } = props;
  const imageSrc = useMemo(() => getBlankCardURL(hidden), []);

  return (
    <button className={'mr-4 flex h-48 items-center justify-center rounded'}>
      <span className='text-xl'>
        <img className='h-48 border-gray-400' src={imageSrc} alt='blank card' />
      </span>
    </button>
  );
}

export default BlankCard;
