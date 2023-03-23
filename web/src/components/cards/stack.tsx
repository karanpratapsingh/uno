import clsx from 'clsx';
import { Card } from '../../types/game';
import BlankCard from './blank';
import UnoCard, { UnoCardSizes } from './uno';

interface CardStackProps {
  className?: string;
  card?: Card;
  size?: UnoCardSizes;
  hidden?: boolean;
  onClick?(): void;
}

function CardStack(props: CardStackProps): React.ReactElement {
  const { className, card, size = 'default', hidden, onClick } = props;

  return (
    <div
      className={clsx('stack', className)}
      onClick={() => onClick && onClick()}
    >
      {card && <UnoCard size={size} card={card} hidden={hidden} />}
      <BlankCard size={size} hidden={hidden} />
      <BlankCard size={size} hidden={hidden} />
      <BlankCard size={size} hidden={hidden} />
    </div>
  );
}

export default CardStack;
