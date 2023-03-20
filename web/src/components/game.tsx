import { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import Card from './card';

interface GameProps {
  socket: Socket;
  started: boolean;
}

function Game(props: GameProps) {
  const { socket, started } = props;

  const [hands, setHands] = useState(null);
  const [gameStack, setGameStack] = useState<any>([]);
  const [remainingCards, setRemainingCards] = useState<any>([]);

  useEffect(() => {
    socket.on('state-change', data => {
      setHands(data.hands);
      setGameStack(data.game_stack);
      setRemainingCards(data.remaining_cards);
    });
  }, []);

  function playCard(playerId: string, cardId: string) {
    socket.emit('play-card', { playerId, cardId });
  }

  function drawCard() {
    socket.emit('draw-card', { player: 'player_2' });
  }

  const gameActive =
    started && hands && gameStack.length && remainingCards.length;

  if (!gameActive) {
    return null;
  }

  const { player_1, player_2 }: any = hands;

  return (
    <div className='flex flex-1 flex-col justify-center'>
      {/* Player 1 */}
      <div className='flex flex-1 items-center'>
        {player_1.map((card: any) => (
          <Card player={{id:'player_1'}} card={card} onClick={playCard} />
        ))}
      </div>

      {/* Card space */}
      <div className='flex flex-1 items-center justify-center'>
        <div className='flex flex-1'>
          <div className='stack' onClick={drawCard}>
            {remainingCards.map((card: any) => (
              <Card card={card} hidden={true} />
            ))}
          </div>
        </div>
        <div className='flex flex-1'>
          <div className='stack'>
            {gameStack.map((card: any) => (
              <Card card={card} />
            ))}
          </div>
        </div>
      </div>

      {/* Player 2 */}
      <div className='flex flex-1 items-center'>
        {player_2.map((card: any) => (
          <Card player={{id:'player_2'}} card={card} onClick={playCard} />
        ))}
      </div>
    </div>
  );
}

export default Game;
