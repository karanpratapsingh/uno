import { defaultHandSize } from '../lib/state';
import { GameAction, GameConfig } from '../types/game';

export const GAME_STATE_REFETCH_INTERVAL =
  import.meta.env.VITE_GAME_STATE_REFETCH_INTERVAL || 10_000;

export const defaultConfig: GameConfig = {
  action: GameAction.Join,
  name: '',
  room: '',
  hand_size: defaultHandSize,
};
