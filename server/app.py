from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import json
from uno import Game

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")

game = Game()


@socketio.on('new-game')
def handle_message(data):
    hands = game.new_game(data['players'], data['hand_size'])
    parsed = [[card.__dict__ for card in hand] for hand in hands]
    emit("new-game", {'hands': parsed}, broadcast=True)


@socketio.on("connect")
def connected():
    print(f"user {request.sid} connected")
    emit("connect", {"data": f"id: {request.sid} is connected"})


@socketio.on("disconnect")
def disconnected():
    print("user disconnected")
    emit("disconnect", f"user {request.sid} disconnected", broadcast=True)


if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000)
