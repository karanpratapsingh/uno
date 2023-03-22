import clsx from 'clsx';
import { useMemo } from 'react';
import { getCardImageURL } from '../../lib/image';
import { Card, Player } from '../../types/game';

interface UnoCardProps {
  currentPlayer: Player;
  card: Card;
  hidden?: boolean;
  disableClick?: boolean;
  onClick?(playerId: string, cardId: string): void;
}

function UnoCard(props: UnoCardProps): React.ReactElement {
  const {
    currentPlayer,
    card,
    hidden = false,
    disableClick = false,
    onClick,
  } = props;

  const allowPlay = !disableClick && onClick;
  const imageSrc = useMemo(() => getCardImageURL(card, hidden), [card, hidden]);

  return (
    <button
      onClick={() => allowPlay && onClick(currentPlayer.id, card.id)}
      className={`mr-4 flex h-48 items-center justify-center rounded ${clsx(
        disableClick && 'no-pointer'
      )}`}
    >
      <span className='text-xl'>
        <img
          className='h-48 border-gray-400'
          src={imageSrc}
          alt={hidden ? 'hidden' : card.id}
        />
      </span>
    </button>
  );
}

export default UnoCard;
