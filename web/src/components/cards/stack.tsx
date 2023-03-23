import { Card } from '../../types/game';
import BlankCard from './blank';
import UnoCard from './uno';

interface CardStackProps {
  card?: Card;
  hidden?: boolean;
  onClick?(): void;
}

function CardStack(props: CardStackProps): React.ReactElement {
  const { card, hidden, onClick } = props;

  return (
    <div className='stack' onClick={() => onClick && onClick()}>
      {card && <UnoCard card={card} hidden={hidden} />}
      <BlankCard hidden={hidden} />
      <BlankCard hidden={hidden} />
      <BlankCard hidden={hidden} />
    </div>
  );
}

export default CardStack;
