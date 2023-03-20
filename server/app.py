from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit, join_room, leave_room, send
from flask_cors import CORS
import json
from uno import Game, Player
import collections
import logging
from lib.notification import Notification
from lib.parsers import parse_game_state, parse_object_list, parse_data_args
import lib.events as events
import logging

log = logging.getLogger(__name__)
log.setLevel(logging.DEBUG)

app = Flask(__name__)
app.logger.setLevel(logging.DEBUG)

CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")

rooms = collections.defaultdict(set)
games = collections.defaultdict(Game)


@socketio.on(events.PLAYER_JOIN)
def on_join(data):
    valid, missing_args = parse_data_args(data, ['name', 'room'])
    if not valid:
        log.error(f'missing args: {", ".join(missing_args)}')
        return

    name, room = data['name'], data['room']

    player = Player(name)
    players = rooms[room]

    players.add(player)
    players.add(Player("developer"))  # For development
    join_room(room)

    log.info(f"{player} has joined the room {room}")
    emit(events.GAME_ROOM, {
         'players': parse_object_list(players)}, to=room)


@socketio.on(events.PLAYER_LEAVE)
def on_leave(data):
    # Throw error or something
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
    emit(events.GAME_ROOM, {'players': parse_object_list(players)}, to=room)


@socketio.on(events.GAME_START)
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
            game = Game(room, players, hand_size)
            games[room] = game
            log.info(f"starting a new game with {players}")
        except Exception as ex:
            Notification(room).error(ex)
            return

    state = game.get_state()
    emit(events.GAME_START, to=room)
    emit(events.GAME_STATE, parse_game_state(state), to=room)


@socketio.on(events.GAME_DRAW)
def on_draw_card(data):
    valid, missing_args = parse_data_args(data, ['room', 'playerId'])
    if not valid:
        log.error(f'missing args: {", ".join(missing_args)}')
        return

    room, playerId = data['room'], data['playerId']

    game = games[room]
    game.draw(playerId)
    state = game.get_state()
    emit(events.GAME_STATE, parse_game_state(state), to=room)


@socketio.on(events.GAME_PLAY)
def on_play_game(data):
    valid, missing_args = parse_data_args(data, ['room', 'playerId', 'cardId'])
    if not valid:
        log.error(f'missing args: {", ".join(missing_args)}')
        return

    room, playerId, cardId = data['room'], data['playerId'], data['cardId']

    game = games[room]
    game.play(playerId, cardId)
    state = game.get_state()
    emit(events.GAME_STATE, parse_game_state(state), to=room)


if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000)
