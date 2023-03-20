import { GameConfig } from '../types/game';

export const minHandSize = 3;
export const defaultHandSize = 7;
export const maxHandSize = 15;

export function validateGameConfig(config: GameConfig): boolean {
  for (const key of ['action', 'name', 'room', 'hand_size']) {
    if (!Object.hasOwn(config, key)) {
      return false;
    }
  }
  return true;
}
