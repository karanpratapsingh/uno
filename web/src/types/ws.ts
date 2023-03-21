import { Hands, Card, Player } from './game';

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
