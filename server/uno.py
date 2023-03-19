import random
import json
import collections

COLORS = ['red', 'blue', 'green', 'yellow']

NUMBER_CARDS = [str(i) for i in (list(range(0, 10)) + list(range(1, 10)))]
PLUS_2_CARDS = ['+2'] * 2
REVERSE_CARDS = ['reverse'] * 2
SKIP_CARDS = ['skip'] * 2

DRAW_CARDS = ['+4', 'wild']

COLOR_CARDS = NUMBER_CARDS + PLUS_2_CARDS + REVERSE_CARDS + SKIP_CARDS


class Card:
    def __init__(self, color, value):
        self.id = f'{value}-{color}'
        self.color = color
        self.value = value

    def isSpecial(self):
        special_cards = set(PLUS_2_CARDS + REVERSE_CARDS +
                            SKIP_CARDS + DRAW_CARDS)
        return self.value in special_cards or self.color == 'black'

    def __repr__(self):
        return f'{self.value} ({self.color})'


DECK = [Card(color, value)
        for color in COLORS for value in COLOR_CARDS] + ([Card('black', value) for value in DRAW_CARDS] * 4)


SHUFFLE_FREQ = 10
PLAYERS = 2


class Game:
    def __init__(self):
        self.deck = DECK

    def new_game(self, hand_size):
        deck = self.deck[::]

        for _ in range(SHUFFLE_FREQ):
            random.shuffle(deck)

        hands = collections.defaultdict(list)
        player_cards = deck[:PLAYERS * hand_size]
        remaining_cards = deck[(PLAYERS * hand_size) + 1:]

        i = 0
        while i < len(player_cards):
            for player in range(PLAYERS):
                hands[f'player_{player+1}'].append(player_cards[i])
                i += 1

        top_card = random.choice(remaining_cards)
        while top_card.isSpecial():
            top_card = random.choice(remaining_cards)

        self.hands = hands
        self.remaining_cards = remaining_cards
        self.game_stack = [top_card]

    def get_state(self):
        return (self.hands, self.remaining_cards, self.game_stack)

    def draw(self, player):
        player_cards = self.hands[player]
        new_card = self.remaining_cards.pop()
        player_cards.append(new_card)

    def play_card(self, player, card):
        player_cards = self.hands[player]

        played_card = Card(card['color'], card['value'])
        idx = [c.id for c in player_cards].index(played_card.id)
        print(f'\n\n {played_card} {idx} \n\n') # TODO: Log this
        player_cards.pop(idx)

        self.game_stack.append(played_card)
