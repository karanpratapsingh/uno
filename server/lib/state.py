import logging
import pickle
from typing import Optional, Set

from core.uno import Game, Player
from lib.env import REDIS_URL
from redis import Redis

log = logging.getLogger('state')
log.setLevel(logging.INFO)

GAME_EXPIRATION_TIME = 86_400  # 1 day
ROOM_EXPIRATION_TIME = 86_400  # 1 day


class State:
    def __init__(self):
        self.redis = Redis.from_url(REDIS_URL)

    def allow_player(self, action: str, room: str, player: Player) -> (bool, Optional[str]):
        # Validate player
        if not player.name or player.name == '':
            return (False, f'name cannot be blank')

        if ' ' in player.name:
            return (False, f'name should not contain white spaces')

        # Validate room
        if room == '':
            return (False, f'room should not be empty')

        if action == "Join":  # Check if room exists
            exists = bool(self.redis.exists(f'players_{room}'))
            if not exists:
                return (False, f'cannot join game, room {room} does not exist')

        # Validate game
        started = bool(self.get_game_by_room(room))
        players = self.get_players_by_room(room)

        if len(players) == Game.MAX_PLAYERS_ALLOWED:
            return (False, f"room is full, max {Game.MAX_PLAYERS_ALLOWED} players are supported")

        if started:
            if player not in players:
                return (False, f'cannot join, game in the room {room} has already started')
        else:
            if player in players:
                return (False, f"name {player.name} is already taken for this room, try a different name")

        return (True, None)

    def get_game_by_room(self, room: str) -> Optional[Game]:
        obj = self.redis.get(f'game_{room}')
        if not obj:
            return None

        return pickle.loads(obj)

    def add_game_to_room(self, room: str, game: Game) -> None:
        obj = pickle.dumps(game)
        self.redis.set(f'game_{room}', obj, ex=GAME_EXPIRATION_TIME)

    def update_game_in_room(self, room: str, game: Game) -> None:
        obj = pickle.dumps(game)
        self.redis.set(f'game_{room}', obj, ex=GAME_EXPIRATION_TIME)

    def get_players_by_room(self, room: str) -> Set[Player]:
        obj = self.redis.get(f'players_{room}')
        if not obj:
            return set()

        return pickle.loads(obj)

    def add_player_to_room(self, room: str, player: Player) -> None:
        log.info(f"adding player {player} to room {room}")

        players = self.get_players_by_room(room)
        players.add(player)

        obj = pickle.dumps(players)
        self.redis.set(f'players_{room}', obj, ex=ROOM_EXPIRATION_TIME)

    def remove_player_from_room(self, room: str, player: Player) -> None:
        log.info(f"removing player {player} from room {room}")

        players = self.get_players_by_room(room)
        players.remove(player)

        obj = pickle.dumps(players)
        self.redis.set(f'players_{room}', obj, ex=ROOM_EXPIRATION_TIME)

    def delete_all(self, room: str) -> None:
        self.delete_room(room)
        self.delete_game(room)

    def delete_room(self, room: str) -> None:
        self.redis.delete(f'players_{room}')
        log.info(f"deleted {room}")

    def delete_game(self, room: str) -> None:
        self.redis.delete(f'game_{room}')
        log.info(f"deleted game for room {room}")
