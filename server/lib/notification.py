from flask_socketio import emit
import lib.events as events


class Notification:
    def __init__(self, room: str):
        self.room = room

    def info(self, message: str) -> None:
        emit(events.GAME_NOTIFY, self.format('info', message), to=self.room)

    def success(self, message: str) -> None:
        emit(events.GAME_NOTIFY, self.format('success', message), to=self.room)

    def warn(self, message: str) -> None:
        emit(events.GAME_NOTIFY, self.format('warn', message), to=self.room)

    def error(self, message: str) -> None:
        emit(events.GAME_NOTIFY, self.format('error', message), to=self.room)

    def format(self, notification_type: str, message: str) -> None:
        return {'type': notification_type, 'message': str(message)}
