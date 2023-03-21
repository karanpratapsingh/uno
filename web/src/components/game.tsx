import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { Card, Events, GameStatePayload, Hands, Player } from '../types/game';
import Avatar from './avatar';
import UnoCard from './uno-card';

interface GameProps {
  currentPlayer: Player;
  players: Player[];
  socket: Socket;
  started: boolean;
  room: string;
}

function Game(props: GameProps): React.ReactElement {
  const { socket, currentPlayer, players, started, room } = props;

  const [hands, setHands] = useState<Hands | null>(null);
  const [gameStack, setGameStack] = useState<Card[]>([]);
  const [remainingCards, setRemainingCards] = useState<Card[]>([]);

  useEffect(() => {
    function onGameState(data: GameStatePayload): void {
      setHands(data.hands);
      setGameStack(data.game_stack);
      setRemainingCards(data.remaining_cards);
    }

    socket.on(Events.GAME_STATE, onGameState);

    return () => {
      socket.off(Events.GAME_STATE, onGameState);
    };
  }, []);

  function playCard(playerId: string, cardId: string): void {
    socket.emit(Events.GAME_PLAY, { playerId, cardId, room });
  }

  function drawCard(): void {
    socket.emit(Events.GAME_DRAW, { playerId: currentPlayer.id, room });
  }

  const gameActive =
    started && hands && gameStack.length && remainingCards.length;

  if (!gameActive) {
    return <></>;
  }

  const [otherPlayer] = players.filter(p => p.id !== currentPlayer.id);
  const otherCards = hands[otherPlayer.id];

  const ownCards = hands[currentPlayer.id];

  return (
    <div className='flex flex-1 flex-col'>
      {/* Other player */}
      <div className='flex flex-col items-center justify-center'>
        <Avatar
          className='my-4'
          name={otherPlayer.name}
          size='small'
          type='row'
        />
        <div className='flex'>
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
        <div className='flex flex-1 justify-center'>
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
      <div className='flex flex-col items-center justify-center'>
        <div className='flex'>
          {ownCards.map((card: Card) => (
            <UnoCard
              currentPlayer={currentPlayer}
              card={card}
              onClick={playCard}
            />
          ))}
        </div>
        <Avatar
          className='mt-4'
          name={currentPlayer.name}
          size='small'
          type='row'
        />
      </div>
    </div>
  );
}

export default Game;
