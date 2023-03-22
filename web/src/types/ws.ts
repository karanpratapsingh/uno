import { Card, Hands, Player } from './game';

export type GameStateResponse = {
  hands: Hands;
  game_stack: Card[];
  remaining_cards: Card[];
};

export type GameNotifyResponse = {
  type: string;
  message: string;
};

export type GameRoomResponse = {
  players: Player[];
};

export enum GameOverReason {
  Won = 'won',
  Error = 'error',
}

export type GameOverResponse = GameOverWonResponse | GameOverErrorResponse;

type GameOverWonResponse = {
  reason: GameOverReason.Won;
  winner: string;
};

type GameOverErrorResponse = {
  reason: GameOverReason.Error;
};
