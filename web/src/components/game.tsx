import { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { Player } from '../types/game';
import Card from './card';

interface GameProps {
  currentPlayer: Player;
  socket: Socket;
  started: boolean;
  room: string;
}

function Game(props: GameProps) {
  const { socket, currentPlayer, started, room } = props;

  const [hands, setHands] = useState<any | null>(null);
  const [gameStack, setGameStack] = useState<any>([]);
  const [remainingCards, setRemainingCards] = useState<any>([]);

  useEffect(() => {
    socket.on('game::state', data => {
      console.log(data);
      setHands(data.hands);
      setGameStack(data.game_stack);
      setRemainingCards(data.remaining_cards);
    });
  }, []);

  function playCard(playerId: string, cardId: string) {
    socket.emit('game::play', { playerId, cardId, room });
  }

  function drawCard() {
    socket.emit('game::draw', { playerId: currentPlayer.id, room });
  }

  const gameActive =
    started && hands && gameStack.length && remainingCards.length;

  if (!gameActive) {
    return null;
  }

  const [otherKey] = Object.keys(hands).filter(key => key !== currentPlayer.id);
  const other = hands[otherKey];
  const own = hands[currentPlayer.id];

  return (
    <div className='flex flex-1 flex-col justify-center'>
      {/* Other player */}
      <div className='flex flex-1 items-center'>
        {other.map((card: any) => (
          <Card card={card} hidden={true} />
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

      {/* Current Player */}
      <div className='flex flex-1 items-center'>
        {own.map((card: any) => (
          <Card player={currentPlayer} card={card} onClick={playCard} />
        ))}
      </div>
    </div>
  );
}

export default Game;
