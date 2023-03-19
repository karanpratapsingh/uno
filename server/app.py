from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit, join_room, leave_room, send
from flask_cors import CORS
import json
from uno import Game
import collections
from player import Player
import logging

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
    username = data['username']
    room = data['room']

    player = Player(username, room)
    rooms[room].add(player)
    join_room(room)
    log.info(f"{player} has join room {room}")
    emit("join", username + ' has entered the room.', to=room)


@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    send(username + ' has left the room.', to=room)


def parse_state(state):
    (hands, remaining_cards, game_stack) = state

    def parse_cards(cards):
        return [card.__dict__ for card in cards]

    parsed_hands = {
        'player_1': parse_cards(hands['player_1']),
        'player_2': parse_cards(hands['player_2']),
    }
    parsed_remaining_cards = parse_cards(remaining_cards)
    parsed_game_stack = parse_cards(game_stack)

    return {
        'hands': parsed_hands,
        'remaining_cards': parsed_remaining_cards,
        'game_stack': parsed_game_stack
    }


@socketio.on('new-game')
def new_game(data):

    game.new_game(data['hand_size'])
    state = game.get_state()
    emit("state-change", parse_state(state))


@socketio.on('draw-card')
def draw_card(data):
    game.draw(data['player'])
    state = game.get_state()
    emit("state-change", parse_state(state))


@socketio.on('play-card')
def draw_card(data):
    game.play_card(data['player'], data['card'])
    state = game.get_state()
    emit("state-change", parse_state(state))


@socketio.on("connect")
def connected():
    # print(f"user {request.sid} connected")
    emit("connect", {"data": f"id: {request.sid} is connected"})


@socketio.on("disconnect")
def disconnected():
    # print("user disconnected")
    emit("disconnect", f"user {request.sid} disconnected")


if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000)
