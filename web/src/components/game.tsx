import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { GAME_STATE_REFETCH_INTERVAL } from '../config/game';
import { Card, Events, Hands, Player } from '../types/game';
import { Routes } from '../types/routes';
import {
  GameOverReason,
  GameOverResponse,
  GameStateResponse,
} from '../types/ws';
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
  const navigate = useNavigate();

  const [hands, setHands] = useState<Hands | null>(null);
  const [gameStack, setGameStack] = useState<Card[]>([]);
  const [remainingCards, setRemainingCards] = useState<Card[]>([]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      socket.emit(Events.GAME_STATE, { room });
    }, GAME_STATE_REFETCH_INTERVAL);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    function onGameState(data: GameStateResponse): void {
      setHands(data.hands);
      setGameStack(data.game_stack);
      setRemainingCards(data.remaining_cards);
    }
    socket.on(Events.GAME_STATE, onGameState);

    function onGameWon(data: GameOverResponse): void {
      const { reason } = data;

      switch (reason) {
        case GameOverReason.Won:
          const { winner } = data;
          navigate(Routes.Won, { state: { winner } });
          break;
      }
    }
    socket.on(Events.GAME_OVER, onGameWon);

    return () => {
      socket.off(Events.GAME_STATE, onGameState);
      socket.off(Events.GAME_OVER, onGameState);
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
