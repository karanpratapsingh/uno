from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit, join_room, leave_room, send
from flask_cors import CORS
import json
from uno import Game
import collections
from player import Player
import logging
from parsers import parse_game_state, parse_object_list

log = logging.getLogger(__name__)
log.setLevel(logging.DEBUG)

app = Flask(__name__)
app.logger.setLevel(logging.DEBUG)

CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")

game = Game()

rooms = collections.defaultdict(set)


@socketio.on('join')
def on_join(data):
    name = data['name']
    room = data['room']

    player = Player(name, room)
    players = rooms[room]

    if player in players:
        emit("room", {'players': parse_object_list(list(players))}, to=room)
        return

    players.add(player)
    join_room(room)
    log.info(f"{player} has joined the room {room}")
    emit("room", {'players': parse_object_list(list(players))}, to=room)


@socketio.on('leave')
def on_leave(data):
    name = data['name']
    room = data['room']

    player = Player(name, room)
    players = rooms[room]

    if player not in players:
        emit("room", {'players': parse_object_list(list(players))}, to=room)
        return

    players.remove(player)
    leave_room(room)

    log.info(f"{player} has left the room {room}")
    emit("room", {'players': parse_object_list(list(players))}, to=room)


@socketio.on('new-game')
def new_game(data):
    game.new(data['hand_size'])
    state = game.get_state()
    emit("state-change", parse_game_state(state))


@socketio.on('draw-card')
def draw_card(data):
    game.draw(data['player'])
    state = game.get_state()
    emit("state-change", parse_game_state(state))


@socketio.on('play-card')
def draw_card(data):
    game.play_card(data['player'], data['card'])
    state = game.get_state()
    emit("state-change", parse_game_state(state))

@socketio.on('connect')
def connect():
    return


if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000)
