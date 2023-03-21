import { Card } from '../types/game';

/**
 * Uno card assets are Public Domain. Free for editorial, educational, commercial,
 * and/or personal projects. No attribution required. More info.
 *
 * Ref: https://creazilla.com/pages/4-license-information
 */
export function getCardImageURL(card: Card, hidden?: boolean): string {
  if (hidden) {
    return getAssetURL('../assets/images/cards/back.svg');
  }

  return getAssetURL(`../assets/images/cards/${card.color}/${card.value}.svg`);
}

export function getAssetURL(relativePath: string): string {
  return new URL(relativePath, import.meta.url).href;
}
