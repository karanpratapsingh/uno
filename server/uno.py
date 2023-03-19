import random
import json

COLORS = ['red', 'blue', 'green', 'yellow']

NUMBER_CARDS = [str(i) for i in (list(range(0, 10)) + list(range(1, 10)))]
PLUS_2_CARDS = ['+2'] * 2
REVERSE_CARDS = ['reverse'] * 2
SKIP_CARDS = ['skip'] * 2

DRAW_CARDS = ['+4', 'wild']

COLOR_CARDS = NUMBER_CARDS + PLUS_2_CARDS + REVERSE_CARDS + SKIP_CARDS


class Card:
    def __init__(self, color, value):
        self.color = color
        self.value = value

    def isSpecial(self):
        special_cards = set(PLUS_2_CARDS + REVERSE_CARDS +
                            SKIP_CARDS + DRAW_CARDS)
        return self.value in special_cards or self.color == 'black'

    # def __repr__(self):
    #     return f'{self.value} ({self.color})'

    # def __dict__(self):
    #     return {'color': self.color, 'value': self.value}


DECK = [Card(color, value)
        for color in COLORS for value in COLOR_CARDS] + ([Card('black', value) for value in DRAW_CARDS] * 4)


SHUFFLE_FREQ = 10


class Game:
    def __init__(self):
        self.deck = DECK

    def new_game(self, players, hand_size):
        deck = self.deck[::]

        for _ in range(SHUFFLE_FREQ):
            random.shuffle(deck)

        hands = [[] for _ in range(players)]
        cards = deck[:players * hand_size]

        i = 0
        while i < len(cards):
            for player in range(players):
                hands[player].append(cards[i])
                i += 1

        return hands
