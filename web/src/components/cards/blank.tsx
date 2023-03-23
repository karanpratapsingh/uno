import clsx from 'clsx';
import { useMemo } from 'react';
import { getBlankCardURL } from '../../lib/image';
import { cardSizes, UnoCardSizes } from './uno';

interface BlankCardProps {
  size?: UnoCardSizes;
  hidden?: boolean;
}

function BlankCard(props: BlankCardProps): React.ReactElement {
  const { size = 'default', hidden } = props;
  const imageSrc = useMemo(() => getBlankCardURL(hidden), []);

  return (
    <button
      className={clsx('mr-4 flex items-center justify-center', cardSizes[size])}
    >
      <img src={imageSrc} alt='blank card' />
    </button>
  );
}

export default BlankCard;
