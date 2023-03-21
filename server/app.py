import collections
import json
import logging

import lib.env as env
import lib.events as events
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room, send
from lib.notification import Notification
from lib.parser import parse_data_args, parse_game_state, parse_object_list

from uno import Game, Player

log = logging.getLogger(__name__)
log.setLevel(logging.DEBUG)

# Server config
app = Flask(__name__)
# TODO: restrict origin for production
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")

# Game state
rooms = collections.defaultdict(set)
games = collections.defaultdict(Game)


@socketio.on(events.PLAYER_JOIN)
def on_join(data):
    try:
        name, room = parse_data_args(data, ['name', 'room'])

        player = Player(name)
        players = rooms[room]

        players.add(player)
        if env.ENVIRONMENT == "development":
            # Add extra player for development
            players.add(Player("developer"))

        join_room(room)

        log.info(f"{player} has joined the room {room}")
        emit(events.GAME_ROOM, {
            'players': parse_object_list(players)}, to=room)
    except Exception as ex:
        log.error(ex)


@socketio.on(events.PLAYER_LEAVE)
def on_leave(data):
    try:
        name, room = parse_data_args(data, ['name', 'room'])

        player = Player(name)
        players = rooms[room]

        players.remove(player)
        leave_room(room)

        log.info(f"{player} has left the room {room}")
        emit(events.GAME_ROOM, {
             'players': parse_object_list(players)}, to=room)
    except Exception as ex:
        log.error(ex)


@socketio.on(events.GAME_START)
def on_new_game(data):
    try:
        room, hand_size = parse_data_args(data, ['room', 'hand_size'])

        game = None
        players = rooms[room]

        if room in games:  # Re-join an existing game
            game = games[room]
            log.info(f"rejoining existing game with players {game.players}")

        if not game:  # Start a new game
            try:
                game = Game(room, players, hand_size)
                games[room] = game
                log.info(f"starting a new game with {players}")
            except Exception as ex:
                Notification(room).error(ex)
                return

        state = game.get_state()
        emit(events.GAME_START, to=room)
        emit(events.GAME_STATE, parse_game_state(state), to=room)
    except Exception as ex:
        log.error(ex)


@socketio.on(events.GAME_DRAW)
def on_draw_card(data):
    try:
        room, playerId = parse_data_args(data, ['room', 'playerId'])

        game = games[room]
        game.draw(playerId)
        state = game.get_state()
        emit(events.GAME_STATE, parse_game_state(state), to=room)
    except Exception as ex:
        log.error(ex)


@socketio.on(events.GAME_PLAY)
def on_play_game(data):
    try:
        room, playerId, cardId = parse_data_args(
            data, ['room', 'playerId', 'cardId'])

        game = games[room]
        game.play(playerId, cardId)
        state = game.get_state()
        emit(events.GAME_STATE, parse_game_state(state), to=room)
    except Exception as ex:
        log.error(ex)


if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000)
