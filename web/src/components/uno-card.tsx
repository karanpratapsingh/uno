import clsx from 'clsx';
import { useMemo } from 'react';
import { getCardImageURL } from '../lib/card';
import { Card, Player } from '../types/game';

interface UnoCardProps {
  currentPlayer: Player;
  card: Card;
  hidden?: boolean;
  disableClick?: boolean;
  onClick?(playerId: string, cardId: string): void;
}

function UnoCard(props: UnoCardProps) {
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
      className={`mr-4 flex h-40 w-32 items-center justify-center rounded ${clsx(
        hidden && 'bg-gray-800',
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
