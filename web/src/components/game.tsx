import { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { Card, Player } from '../types/game';
import UnoCard from './card';

interface GameProps {
  currentPlayer: Player;
  players: Player[];
  socket: Socket;
  started: boolean;
  room: string;
}

function Game(props: GameProps) {
  const { socket, currentPlayer, players, started, room } = props;

  const [hands, setHands] = useState<any | null>(null);
  const [gameStack, setGameStack] = useState<any>([]);
  const [remainingCards, setRemainingCards] = useState<any>([]);

  useEffect(() => {
    socket.on('game::state', data => {
      setHands(data.hands);
      setGameStack(data.game_stack);
      setRemainingCards(data.remaining_cards);
    });

    return () => {
      socket.off('game::state');
    };
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

  const [otherPlayer] = players.filter(p => p.id !== currentPlayer.id);
  const otherCards = hands[otherPlayer.id];

  const ownCards = hands[currentPlayer.id];

  return (
    <div className='flex flex-1 flex-col justify-center'>
      {/* Other player */}
      <div className='mt-4 flex flex-col'>
        <span className='mb-4 text-center'>{otherPlayer.name}</span>
        <div className='flex items-center'>
          {otherCards.map((card: Card) => (
            <UnoCard
              key={card.id}
              currentPlayer={currentPlayer}
              card={card}
              hidden
              disableClick
            />
          ))}
        </div>
      </div>

      {/* Card space */}
      <div className='flex flex-1 items-center justify-center'>
        <div className='flex flex-1'>
          <div className='stack' onClick={drawCard}>
            {remainingCards.map((card: Card) => (
              <UnoCard
                key={card.id}
                currentPlayer={currentPlayer}
                card={card}
                hidden
              />
            ))}
          </div>
        </div>
        <div className='flex flex-1'>
          <div className='stack'>
            {gameStack.map((card: Card) => (
              <UnoCard
                key={card.id}
                currentPlayer={currentPlayer}
                card={card}
                disableClick
              />
            ))}
          </div>
        </div>
      </div>

      {/* Current Player */}
      <div className='flex flex-col'>
        <div className='flex items-center'>
          {ownCards.map((card: Card) => (
            <UnoCard
              currentPlayer={currentPlayer}
              card={card}
              onClick={playCard}
            />
          ))}
        </div>
        <span className='mt-4 text-center'>{currentPlayer.name}</span>
      </div>
    </div>
  );
}

export default Game;
