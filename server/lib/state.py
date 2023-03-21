import logging
import pickle
from typing import Optional, Set

from core.uno import Game, Player
from lib.env import REDIS_HOST
from redis import Redis

log = logging.getLogger(__name__)
log.setLevel(logging.DEBUG)

GAME_EXPIRATION_TIME = 86_400  # 1 day
ROOM_EXPIRATION_TIME = 86_400  # 1 day


class State:
    def __init__(self):
        self.redis = Redis(host=REDIS_HOST)

    def room_exists(self, room: str) -> bool:
        exists = self.redis.exists(f'players_{room}')
        return bool(exists)

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
