from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit, join_room, leave_room, send
from flask_cors import CORS
import json
from uno import Game
import collections
from player import Player
import logging
from parsers import parse_game_state, parse_object_list, parse_notification

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
    name, room = data['name'], data['room']

    player = Player(name)
    players = rooms[room]

    players.add(player)
    join_room(room)

    log.info(f"{player} has joined the room {room}")
    emit("game::room", {'players': parse_object_list(players)}, to=room)


@socketio.on('player::leave')
def on_leave(data):
    name, room = data['name'], data['room']

    player = Player(name)
    players = rooms[room]

    players.remove(player)
    leave_room(room)

    log.info(f"{player} has left the room {room}")
    emit("game::room", {'players': parse_object_list(players)}, to=room)


@socketio.on('game::init')
def new_game(data):
    room, hand_size = data['room'], data['hand_size']

    game = None
    players = rooms[room]
    try:
        game = Game(players, hand_size)
    except Exception as ex:
        emit("game::notify", parse_notification('error', ex), to=room)

    if not game:
        return

    games[room] = game
    log.info(f"starting a new game with {players} hand_size: {hand_size}")
    state = game.get_state()

    emit("game::start", to=room)
    emit("game::state", parse_game_state(state), to=room)


@socketio.on('game::draw')
def draw_card(data):
    room, playerId = data['room'], data['playerId']

    game = games[room]
    game.draw(playerId)
    state = game.get_state()
    emit("game::state", parse_game_state(state), to=room)


@socketio.on('game::play')
def draw_card(data):
    room, playerId, cardId = data['room'], data['playerId'], data['cardId']

    game = games[room]
    game.play_card(playerId, cardId)
    state = game.get_state()
    emit("game::state", parse_game_state(state), to=room)


if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000)
