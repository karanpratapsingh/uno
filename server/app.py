from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")


@socketio.on('data')
def handle_message(data):
    print("data from the front end: ", str(data))
    emit("data", {'data': data, 'id': request.sid}, broadcast=True)


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
