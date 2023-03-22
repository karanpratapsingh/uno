import { Card } from '../types/game';

/**
 * Uno card assets are Public Domain. Free for editorial, educational, commercial,
 * and/or personal projects. No attribution required. More info.
 *
 * Ref: https://creazilla.com/pages/4-license-information
 */
export function getCardImageURL(card: Card, hidden?: boolean): string {
  if (hidden) {
    return new URL('../assets/images/cards/back.svg', import.meta.url).href;
  }

  return new URL(
    `../assets/images/cards/${card.color}/${card.value}.svg`,
    import.meta.url
  ).href;
}

export function getBlankCardURL(hidden?: boolean): string {
  if (hidden) {
    return new URL('../assets/images/cards/back.svg', import.meta.url).href;
  }

  return new URL('../assets/images/cards/blank.svg', import.meta.url).href;
}

export const logoURL = new URL('../assets/images/logo.svg', import.meta.url)
  .href;
