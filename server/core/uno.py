from lib.notification import Notification
import random
import json
import collections
import logging

log = logging.getLogger(__name__)
log.setLevel(logging.DEBUG)

COLORS = ['red', 'blue', 'green', 'yellow']
NUMBER_CARDS = [str(i) for i in (list(range(0, 10)) + list(range(1, 10)))]
DRAW_TWO_CARDS = ['draw-two'] * 2
REVERSE_CARDS = ['reverse'] * 2
SKIP_CARDS = ['skip'] * 2

DRAW_FOUR_CARDS = ['draw-four'] * 4
WILD_CARDS = ['wild'] * 4
COLOR_CARDS = NUMBER_CARDS + DRAW_TWO_CARDS + REVERSE_CARDS + SKIP_CARDS


class Player:
    def __init__(self, name):
        self.id = f'player-{name}'
        self.name = name
        self.online = True

    def __repr__(self):
        return f"Player(id={self.id}, name={self.name})"

    def __hash__(self):
        return hash(self.id)

    def __eq__(self, obj):
        return isinstance(obj, type(self)) and self.id == obj.id


class Card:
    def __init__(self, color, value):
        self.id = f'{value}-{color}'
        self.color = color
        self.value = value

    def is_special(self):
        special_cards = set(DRAW_TWO_CARDS + REVERSE_CARDS +
                            SKIP_CARDS + DRAW_FOUR_CARDS + WILD_CARDS)
        return self.value in special_cards or self.color == 'black'

    def is_color_special(self):
        special_cards = set(DRAW_TWO_CARDS + REVERSE_CARDS + SKIP_CARDS)
        return self.value in special_cards or self.color != 'black'

    def is_black(self):
        return self.color == 'black'

    def is_draw_four(self):
        return self.value == 'draw-four'

    def is_wild(self):
        return self.value == 'wild'

    def __repr__(self):
        return f'Card(color={self.color}, value={self.value})'


SHUFFLE_FREQ = 10

DECK = [Card(color, value)
        for color in COLORS for value in COLOR_CARDS] + ([Card('black', value) for value in (DRAW_FOUR_CARDS + WILD_CARDS)])


class Game:
    def __init__(self, room,  players, hand_size):
        self.hands = collections.defaultdict(list)
        self.players = list(players)
        self.notify = Notification(room)

        if len(self.players) < 2:
            raise Exception("need at least 2 players to start the game")
            return

        # Shuffle deck
        deck = DECK[::]
        for _ in range(SHUFFLE_FREQ):
            random.shuffle(deck)

        TOTAL_PLAYERS = len(players)
        self.remaining_cards = deck[(TOTAL_PLAYERS * hand_size) + 1:]
        player_cards = deck[:TOTAL_PLAYERS * hand_size]

        # Distribute cards (alternatively)
        i = 0
        while i < len(player_cards):
            for player in players:
                self.hands[player].append(player_cards[i])
                i += 1

        # Pick a top card (skip special cards)
        top_card = random.choice(self.remaining_cards)
        while top_card.is_special():
            top_card = random.choice(self.remaining_cards)

        self.game_stack = [top_card]

    def get_state(self):
        return (self.hands, self.remaining_cards, self.game_stack)

    def draw(self, playerId):
        player = self.find_object(self.players, playerId)
        player_cards = self.hands[player]

        new_card = self.remaining_cards.pop()
        player_cards.append(new_card)

    def play(self, playerId, cardId):
        player = self.find_object(self.players, playerId)
        player_cards = self.hands[player]
        card = self.find_object(player_cards, cardId)
        top_card = self.game_stack[0]

        def execute_hand():
            nonlocal player_cards, card

            # Find and remove card from the current player's hand
            idx = self.find_object_idx(player_cards, card.id)
            player_cards.pop(idx)

            # Insert played card top of the game stack
            self.game_stack.insert(0, card)

            if len(player_cards) == 1:
                self.notify.success(f"UNO!")

        # Can play any card on top of black cards
        if not card.is_black() and top_card.is_black():
            execute_hand()
            return

        if card.is_black() and top_card.is_black():
            # Cannot play wild card on top of draw four and vice-versa
            if ((card.is_draw_four() and top_card.is_wild()) or
                    (card.is_wild() and top_card.is_draw_four())):
                self.notify.error(
                    f"cannot play a {card.value} card top of a {top_card.value} card")
                return
            execute_hand()
            return

        same_color = card.color == top_card.color
        same_value = card.value == top_card.value

        if same_color or same_value:
            execute_hand()
            return

        if same_color and card.is_color_special():
            execute_hand()
            return

        if card.is_black():
            execute_hand()
            return

    def find_object(self, objects, id):
        idx = self.find_object_idx(objects, id)
        return objects[idx]

    def find_object_idx(self, objects, id):
        return [obj.id for obj in objects].index(id)
