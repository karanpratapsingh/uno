import random
import json
import collections
from player import Player
import logging

log = logging.getLogger(__name__)
log.setLevel(logging.DEBUG)

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
        return f'Card(color={self.color}, value={self.value})'


DECK = [Card(color, value)
        for color in COLORS for value in COLOR_CARDS] + ([Card('black', value) for value in DRAW_CARDS] * 4)


SHUFFLE_FREQ = 10


class Game:
    def __init__(self, players, hand_size):
        self.hands = collections.defaultdict(list)
        self.players = players

        if len(self.players) < 2:
            raise Exception("Cannot start the game without atleast 2 players")

        # Shuffle deck
        deck = DECK[::]
        for _ in range(SHUFFLE_FREQ):
            random.shuffle(deck)

        TOTAL_PLAYERS = len(players)
        self.remaining_cards = deck[(TOTAL_PLAYERS * hand_size) + 1:]
        player_cards = deck[:TOTAL_PLAYERS * hand_size]

        # Distribute cards
        i = 0
        while i < len(player_cards):
            for player in players:
                self.hands[player].append(player_cards[i])
                i += 1

        # Pick top card
        top_card = random.choice(self.remaining_cards)
        while top_card.isSpecial():
            top_card = random.choice(self.remaining_cards)

        self.game_stack = [top_card]

    def get_state(self):
        return (self.hands, self.remaining_cards, self.game_stack)

    def draw(self, playerId):
        player = self.find_object(self.players, playerId)
        player_cards = self.hands[player]

        new_card = self.remaining_cards.pop()
        player_cards.append(new_card)

    def play_card(self, playerId, cardId):
        player = self.find_object(self.players, playerId)

        player_cards = self.hands[player]
        idx = self.find_object_idx(player_cards, cardId)
        player_cards.pop(idx)
        self.game_stack.insert(0, self.game_stack)

    def find_object(self, objects, id):
        idx = self.find_object_idx(objects, id)
        return objects[idx]

    def find_object_idx(self, objects, id):
        return [obj.id for obj in objects].index(id)
