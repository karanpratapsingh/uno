import clsx from 'clsx';
import { useMemo } from 'react';
import { getCardImageURL } from '../../lib/image';
import { Card, Player } from '../../types/game';

export type UnoCardSizes = 'large' | 'default';

interface UnoCardProps {
  card: Card;
  currentPlayer?: Player;
  hidden?: boolean;
  size?: UnoCardSizes;
  onClick?(playerId: string, cardId: string): void;
}

export const cardSizes: Record<UnoCardSizes, string> = {
  default: 'h-36 w-20 md:h-44 md:w-28',
  large: 'h-40 w-24 md:h-48 md:w-32',
};

function UnoCard(props: UnoCardProps): React.ReactElement {
  const {
    currentPlayer,
    size = 'default',
    card,
    hidden = false,
    onClick,
  } = props;

  const allowPlay = onClick && currentPlayer;
  const imageSrc = useMemo(
    () => getCardImageURL(card, hidden),
    [card.id, hidden]
  );

  return (
    <button
      onClick={() => allowPlay && onClick(currentPlayer.id, card.id)}
      className={`mr-4 flex items-center justify-center ${clsx(
        cardSizes[size],
        !onClick && 'no-pointer',
        onClick &&
          'hover:scale-110 transition-transform duration-200 ease-in-out'
      )}`}
    >
      <img src={imageSrc} alt={hidden ? 'hidden' : card.id} />
    </button>
  );
}

export default UnoCard;
