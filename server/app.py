import collections
import json
import logging
from typing import Any, DefaultDict, Set

import lib.env as env
import lib.events as events
from core.uno import Game, GameOverReason, Player
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room, send
from lib.notification import Notification
from lib.parser import parse_data_args, parse_game_state, parse_object_list
from lib.state import State

logging.basicConfig(format='%(levelname)s[%(name)s]: %(message)s')
log = logging.getLogger(__name__)
log.setLevel(logging.INFO)

# Server config
# TODO: restrict origin for production
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")

state = State()


@app.post('/api/game/allow')
def allow_player():
    try:
        action, name, room = parse_data_args(request.json, ['action', 'name', 'room'])
        player = Player(name)
        allow, reason = state.allow_player(action, room, player)
        return {'allow': allow, 'reason': reason}
    except Exception as ex:
        log.error(ex)
        return {'allow': False, 'reason': str(ex)}


@socketio.on(events.PLAYER_JOIN)
def on_join(data):
    try:
        name, room = parse_data_args(data, ['name', 'room'])

        player = Player(name)
        state.add_player_to_room(room, player)
        join_room(room)
        log.info(f"{player} has joined the room {room}")

        # Add extra player for development
        if env.ENVIRONMENT == "development":
            dev_player = Player("developer")
            state.add_player_to_room(room, dev_player)

        players = state.get_players_by_room(room)
        emit(events.GAME_ROOM, {'players': parse_object_list(players)}, to=room)
    except Exception as ex:
        log.error(ex)


@socketio.on(events.PLAYER_LEAVE)
def on_leave(data):
    try:
        name, room = parse_data_args(data, ['name', 'room'])

        player = Player(name)
        state.remove_player_from_room(room, player)
        leave_room(room)
        log.info(f"{player} has left the room {room}")

        players = state.get_players_by_room(room)
        emit(events.GAME_ROOM, {'players': parse_object_list(players)}, to=room)
    except Exception as ex:
        log.error(ex)


@socketio.on(events.GAME_START)
def on_game_start(data):
    try:
        room, hand_size = parse_data_args(data, ['room', 'hand_size'])

        game = state.get_game_by_room(room)
        players = state.get_players_by_room(room)

        if not game:  # Start a new game
            try:
                game = Game(room, players, hand_size)
                state.add_game_to_room(room, game)
            except Exception as ex:
                Notification(room).error(ex)
                log.error(ex)
                return

        log.info(f"starting a new game in room {room} with players {players}")
        game_state = game.get_state()
        emit(events.GAME_START, to=room)
        emit(events.GAME_STATE, parse_game_state(game_state), to=room)
    except Exception as ex:
        log.error(ex)


@socketio.on(events.GAME_DRAW)
def on_draw_card(data):
    try:
        room, playerId = parse_data_args(data, ['room', 'playerId'])

        game = state.get_game_by_room(room)
        game.draw(playerId)
        game_state = game.get_state()
        emit(events.GAME_STATE, parse_game_state(game_state), to=room)
        state.update_game_in_room(room, game)
    except Exception as ex:
        log.error(ex)


@socketio.on(events.GAME_PLAY)
def on_play_game(data):
    try:
        room, playerId, cardId = parse_data_args(data, ['room', 'playerId', 'cardId'])

        game = state.get_game_by_room(room)

        def on_game_over(reason: GameOverReason, data: Any):
            nonlocal room

            if reason == GameOverReason.WON:
                log.info(f'player {data} won game {room}')
                emit(events.GAME_OVER, {'reason': reason.value, 'winner': data.name}, to=room)
            state.cleanup(room)

        game.play(playerId, cardId, on_game_over)

        game_state = game.get_state()
        emit(events.GAME_STATE, parse_game_state(game_state), to=room)
        state.update_game_in_room(room, game)
    except Exception as ex:
        log.error(ex)


@socketio.on(events.GAME_STATE)
def on_game_state(data):
    try:
        room, = parse_data_args(data, ['room'])

        game = state.get_game_by_room(room)
        if game:
            game_state = game.get_state()
            emit(events.GAME_STATE, parse_game_state(game_state), to=room)
    except Exception as ex:
        log.error(ex)


if __name__ == '__main__':
    socketio.run(app, port=5000)
