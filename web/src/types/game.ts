export type Hands = Record<string, Card[]>;

export type GameStatePayload = {
  hands: Hands;
  game_stack: Card[];
  remaining_cards: Card[];
};

export type GameNotifyPaylod = {
  type: string;
  message: string;
};

export type GameRoomPaylod = {
  players: Player[];
};

export enum Events {
  GAME_ROOM = 'game::room',
  GAME_START = 'game::start',
  GAME_STATE = 'game::state',
  GAME_NOTIFY = 'game::notify',
  GAME_PLAY = 'game::play',
  GAME_DRAW = 'game::draw',
  PLAYER_JOIN = 'player::join',
  PLAYER_LEAVE = 'player::leave',
}

export type GameConfig = {
  action: GameAction;
  name: string;
  room: string;
  hand_size: number;
};

export enum GameAction {
  Host = 'Host',
  Join = 'Join',
}

export type Card = {
  id: string;
  color: string;
  value: string;
};

export type Player = {
  id: string;
  name: string;
};
