import clsx from 'clsx';
import { AiOutlinePlus, AiOutlineStop, AiOutlineUndo } from 'react-icons/ai';
import { HiSquares2X2 } from 'react-icons/hi2';
import {
  RiNumber0,
  RiNumber1,
  RiNumber2,
  RiNumber3,
  RiNumber4,
  RiNumber5,
  RiNumber6,
  RiNumber7,
  RiNumber8,
  RiNumber9,
} from 'react-icons/ri';

interface CardProps { // TODO
}

function Card(props: any) {
  const { player, color, value, hidden = false, onClick } = props;

  const cardColor: Record<any, string> = {
    red: 'bg-red-400',
    blue: 'bg-blue-400',
    green: 'bg-green-400',
    yellow: 'bg-yellow-200',
    black: 'bg-gray-700',
  };

  const cardValue: Record<string, React.ReactNode> = {
    '0': <RiNumber0 />,
    '1': <RiNumber1 />,
    '2': <RiNumber2 />,
    '3': <RiNumber3 />,
    '4': <RiNumber4 />,
    '5': <RiNumber5 />,
    '6': <RiNumber6 />,
    '7': <RiNumber7 />,
    '8': <RiNumber8 />,
    '9': <RiNumber9 />,
    '+2': (
      <div className='flex'>
        <AiOutlinePlus />
        <RiNumber2 />
      </div>
    ),
    '+4': (
      <div className='flex'>
        <AiOutlinePlus className='text-white' />
        <RiNumber4 className='text-white' />
      </div>
    ),
    skip: <AiOutlineStop />,
    reverse: <AiOutlineUndo />,
    wild: <HiSquares2X2 className='text-white' />,
  };

  return (
    <button
      onClick={onClick && (() => onClick(player, { color, value }))}
      className={`mr-4 flex h-40 w-32 items-center justify-center rounded ${clsx(
        hidden && 'bg-gray-800',
        !hidden && cardColor[color]
      )}`}
    >
      <span className='text-3xl'>
        {hidden ? <span className='text-white'>UNO</span> : cardValue[value]}
      </span>
    </button>
  );
}

export default Card;
