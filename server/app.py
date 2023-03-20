from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit, join_room, leave_room, send
from flask_cors import CORS
import json
from uno import Game
import collections
from player import Player
import logging
from parsers import parse_game_state, parse_object_list, parse_notification, parse_data_args

import logging

log = logging.getLogger(__name__)
log.setLevel(logging.DEBUG)

app = Flask(__name__)
app.logger.setLevel(logging.DEBUG)

CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")

rooms = collections.defaultdict(set)
games = collections.defaultdict(Game)


@socketio.on('player::join')
def on_join(data):
    valid, missing_args = parse_data_args(data, ['name', 'room'])
    if not valid:
        log.error(f'missing args: {", ".join(missing_args)}')
        return

    name, room = data['name'], data['room']

    player = Player(name)
    players = rooms[room]

    players.add(player)
    join_room(room)

    log.info(f"{player} has joined the room {room}")
    emit("game::room", {'players': parse_object_list(players)}, to=room)


@socketio.on('player::leave')
def on_leave(data):
    valid, missing_args = parse_data_args(data, ['name', 'room'])
    if not valid:
        log.error(f'missing args: {", ".join(missing_args)}')
        return

    name, room = data['name'], data['room']

    player = Player(name)
    players = rooms[room]

    players.remove(player)
    leave_room(room)

    log.info(f"{player} has left the room {room}")
    emit("game::room", {'players': parse_object_list(players)}, to=room)


@socketio.on('game::init')
def on_new_game(data):
    valid, missing_args = parse_data_args(data, ['room', 'hand_size'])
    if not valid:
        log.error(f'missing args: {", ".join(missing_args)}')
        return

    room, hand_size = data['room'], data['hand_size']

    game = None
    players = rooms[room]

    if room in games:  # Re-join an existing game
        game = games[room]
        log.info(f"found an existing game with players {game.players}")

    if not game:  # Start a new game
        try:
            game = Game(players, hand_size)
            games[room] = game
            log.info(f"starting a new game with {players}")
        except Exception as ex:
            emit("game::notify", parse_notification('warn', ex), to=room)
            return

    state = game.get_state()
    emit("game::start", to=room)
    emit("game::state", parse_game_state(state), to=room)


@socketio.on('game::draw')
def on_draw_card(data):
    valid, missing_args = parse_data_args(data, ['room', 'playerId'])
    if not valid:
        log.error(f'missing args: {", ".join(missing_args)}')
        return

    room, playerId = data['room'], data['playerId']

    game = games[room]
    game.draw(playerId)
    state = game.get_state()
    emit("game::state", parse_game_state(state), to=room)


@socketio.on('game::play')
def on_play_game(data):
    valid, missing_args = parse_data_args(data, ['room', 'playerId', 'cardId'])
    if not valid:
        log.error(f'missing args: {", ".join(missing_args)}')
        return

    room, playerId, cardId = data['room'], data['playerId'], data['cardId']

    game = games[room]
    game.play_card(playerId, cardId)
    state = game.get_state()
    emit("game::state", parse_game_state(state), to=room)


if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000)
