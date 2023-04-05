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
import CardStack from './cards/stack';
import UnoCard from './cards/uno';
import Loader from './loader';

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
  const [topCard, setTopCard] = useState<Card | null>(null);

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
      setTopCard(data.top_card);
    }
    socket.on(Events.GAME_STATE, onGameState);

    function onGameOver(data: GameOverResponse): void {
      const { reason } = data;

      switch (reason) {
        case GameOverReason.Won:
          const { winner } = data;
          navigate(Routes.Won, { state: { winner } });
          break;
        case GameOverReason.InsufficientPlayers:
          setTimeout(() => {
            navigate(0); // Refresh
          }, 5000);
          break;
      }
    }
    socket.on(Events.GAME_OVER, onGameOver);

    return () => {
      socket.off(Events.GAME_STATE, onGameState);
      socket.off(Events.GAME_OVER, onGameState);
    };
  }, []);

  function playCard(playerId: string, cardId: string): void {
    socket.emit(Events.GAME_PLAY, {
      player_id: playerId,
      card_id: cardId,
      room,
    });
  }

  function drawCard(): void {
    socket.emit(Events.GAME_DRAW, { player_id: currentPlayer.id, room });
  }

  const gameLoaded = started && hands && topCard && players.length > 1;

  if (!gameLoaded) {
    return <Loader label='Loading game...' />;
  }

  const [otherPlayer] = players.filter(p => p.id !== currentPlayer.id);
  const otherCards = hands[otherPlayer.id];

  const ownCards = hands[currentPlayer.id];

  return (
    <div className='flex flex-1 flex-col'>
      {/* Other player */}
      <div className='flex flex-1 flex-col justify-center'>
        <Avatar
          className='self-center my-4'
          name={otherPlayer.name}
          size='small'
          type='row'
        />

        <div className='flex flex-1 overflow-x-scroll items-center justify-start'>
          <div className='flex'>
            {otherCards.map((card: Card, index: number) => (
              <UnoCard
                key={`${index}-${card.id}`}
                card={card}
                currentPlayer={currentPlayer}
                hidden
              />
            ))}
          </div>
        </div>
      </div>

      {/* Card space */}
      <div className='flex flex-1 items-center justify-center my-8 lg:my-0'>
        <CardStack
          className='mr-2 md:mr-12 lg:mr-24'
          size='large'
          onClick={drawCard}
          hidden
        />
        <CardStack
          className='ml-2 md:ml-12 lg:ml-24'
          size='large'
          card={topCard}
        />
      </div>

      {/* Current Player */}
      <div className='flex flex-1 flex-col justify-center'>
        <div className='flex flex-1 overflow-x-scroll items-center justify-start'>
          <div className='flex'>
            {ownCards.map((card: Card, index: number) => (
              <UnoCard
                key={`${index}-${card.id}`}
                card={card}
                currentPlayer={currentPlayer}
                onClick={playCard}
              />
            ))}
          </div>
        </div>
        <Avatar
          className='self-center my-4 lg:mb-0'
          name={currentPlayer.name}
          size='small'
          type='row'
        />
      </div>
    </div>
  );
}

export default Game;
