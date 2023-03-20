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
