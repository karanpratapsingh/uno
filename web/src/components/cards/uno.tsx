import clsx from 'clsx';
import { useMemo } from 'react';
import { getCardImageURL } from '../../lib/image';
import { Card, Player } from '../../types/game';

interface UnoCardProps {
  card: Card;
  currentPlayer?: Player;
  hidden?: boolean;
  onClick?(playerId: string, cardId: string): void;
}

function UnoCard(props: UnoCardProps): React.ReactElement {
  const { currentPlayer, card, hidden = false, onClick } = props;

  const allowPlay = onClick && currentPlayer;
  const imageSrc = useMemo(
    () => getCardImageURL(card, hidden),
    [card.id, hidden]
  );

  return (
    <button
      onClick={() => allowPlay && onClick(currentPlayer.id, card.id)}
      className={`mr-4 flex h-48 items-center justify-center rounded ${clsx(
        !onClick && 'no-pointer'
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
