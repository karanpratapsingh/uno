import { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import Card from './card';

interface GameProps {
  socket: Socket;
}

function Game(props: GameProps) {
  const { socket } = props;

  const [hands, setHands] = useState(null);
  const [gameStack, setGameStack] = useState<any>([]);
  const [remainingCards, setRemainingCards] = useState<any>([]);

  useEffect(() => {
    socket.on('state-change', data => {
      setHands(data.hands);
      setGameStack(data.game_stack.reverse());
      setRemainingCards(data.remaining_cards);
    });
  }, []);

  function playCard(player: string, card: any) {
    socket.emit('play-card', { player, card });
  }

  function drawCard() {
    socket.emit('draw-card', { player: 'player_2' });
  }

  const { player_1, player_2 }: any = hands;

  return (
    <div className='flex flex-1 flex-col justify-center'>
      {/* Player 1 */}
      <div className='flex flex-1 items-center'>
        {player_1.map((card: any) => (
          <Card player={'player_1'} {...card} onClick={playCard} />
        ))}
      </div>

      {/* Card space */}
      <div className='flex flex-1 items-center justify-center'>
        <div className='flex flex-1'>
          <div className='stack' onClick={drawCard}>
            {remainingCards.map((card: any) => (
              <Card {...card} hidden={true} />
            ))}
          </div>
        </div>
        <div className='flex flex-1'>
          <div className='stack'>
            {gameStack.map((card: any) => (
              <Card {...card} />
            ))}
          </div>
        </div>
      </div>

      {/* Player 2 */}
      <div className='flex flex-1 items-center'>
        {player_2.map((card: any) => (
          <Card player={'player_2'} {...card} onClick={playCard} />
        ))}
      </div>
    </div>
  );
}

export default Game;
