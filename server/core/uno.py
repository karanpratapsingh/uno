import collections
import json
import random
from enum import Enum
from typing import Any, DefaultDict, List, Tuple

from lib.notification import Notification


class Player:
    def __init__(self, name):
        self.id: str = f'player-{name}'
        self.name: str = name

    def __repr__(self) -> str:
        return f"Player(id={self.id}, name={self.name})"

    def __hash__(self) -> int:
        return hash(self.id)

    def __eq__(self, obj) -> bool:
        return isinstance(obj, type(self)) and self.id == obj.id


class Card:
    def __init__(self, color, value):
        self.id: str = f'{value}-{color}'
        self.color: str = color
        self.value: str = value

    def is_special(self) -> bool:
        special_cards = set(Deck.DRAW_TWO_CARDS + Deck.REVERSE_CARDS +
                            Deck.SKIP_CARDS + Deck.DRAW_FOUR_CARDS + Deck.WILD_CARDS)
        return self.value in special_cards or self.color == 'black'

    def is_color_special(self) -> bool:
        special_cards = set(Deck.DRAW_TWO_CARDS + Deck.REVERSE_CARDS + Deck.SKIP_CARDS)
        return self.value in special_cards or self.color != 'black'

    def is_black(self) -> bool:
        return self.color == 'black'

    def is_draw_four(self) -> bool:
        return self.value == 'draw-four'

    def is_wild(self) -> bool:
        return self.value == 'wild'

    def __repr__(self) -> str:
        return f'Card(color={self.color}, value={self.value})'


class Deck:
    SHUFFLE_FREQ = 50
    COLORS = ['red', 'blue', 'green', 'yellow']
    NUMBER_CARDS = [str(i) for i in (list(range(0, 10)) + list(range(1, 10)))]
    DRAW_TWO_CARDS = ['draw-two'] * 2
    REVERSE_CARDS = ['reverse'] * 2
    SKIP_CARDS = ['skip'] * 2

    DRAW_FOUR_CARDS = ['draw-four'] * 4
    WILD_CARDS = ['wild'] * 4
    COLOR_CARDS = NUMBER_CARDS + DRAW_TWO_CARDS + REVERSE_CARDS + SKIP_CARDS

    def __init__(self):
        color_cards = [Card(color, value) for color in self.COLORS for value in self.COLOR_CARDS]
        black_cards = [Card('black', value) for value in (self.DRAW_FOUR_CARDS + self.WILD_CARDS)]

        self.cards: List[Card] = color_cards + black_cards
        self.shuffle()

    def get_cards(self) -> List[Card]:
        return self.cards

    def shuffle(self):
        for _ in range(self.SHUFFLE_FREQ):
            random.shuffle(self.cards)


class GameOverReason(Enum):
    WON = 'won'
    ERROR = 'error'
    # PLAYERS_LEFT = 'players-left' TODO: Redirect to room when insufficient players


class Game:
    def __init__(self, room,  players, hand_size):
        self.hands: DefaultDict[Player, List[Card]] = collections.defaultdict(list)
        self.players: List[Player] = list(players)
        self.notify = Notification(room)
        self.deck = Deck()

        if len(self.players) < 2:
            raise Exception("need at least 2 players to start the game")
            return

        cards = self.deck.get_cards()

        TOTAL_PLAYERS = len(players)
        self.remaining_cards: List[Card] = cards[(
            TOTAL_PLAYERS * hand_size) + 1:]
        player_cards = cards[:TOTAL_PLAYERS * hand_size]

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

        self.game_stack: List[Card] = [top_card]

    def get_state(self) -> Tuple[DefaultDict[Player, List[Card]], Card]:
        top_card = self.get_top_card()
        return (self.hands, top_card)

    def get_top_card(self):
        return self.game_stack[-1]

    def draw(self, playerId) -> None:
        player = self.find_object(self.players, playerId)
        player_cards = self.hands[player]

        new_card = self.remaining_cards.pop()
        player_cards.append(new_card)

    def play(self, playerId, cardId, on_game_over) -> None:
        player = self.find_object(self.players, playerId)
        player_cards = self.hands[player]
        card = self.find_object(player_cards, cardId)
        top_card = self.get_top_card()

        def execute_hand():
            nonlocal player_cards, card

            # Find and remove card from the current player's hand
            idx = self.find_object_idx(player_cards, card.id)
            player_cards.pop(idx)

            # Insert played card top of the game stack
            self.game_stack.append(card)

            if len(player_cards) == 1:
                self.notify.success(f"UNO! by {player.name}")

            if len(player_cards) == 0:
                on_game_over(GameOverReason.WON, player)

        # Can play any card on top of black cards
        if not card.is_black() and top_card.is_black():
            execute_hand()
            return

        if card.is_black() and top_card.is_black():
            # Cannot play wild card on top of draw four and vice-versa
            if ((card.is_draw_four() and top_card.is_wild()) or
                    (card.is_wild() and top_card.is_draw_four())):
                self.notify.error(
                    f"cannot play a {card.value} card on top of a {top_card.value} card")
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
