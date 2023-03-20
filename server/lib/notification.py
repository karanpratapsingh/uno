from flask_socketio import emit
import lib.events as events


class Notification:
    def __init__(self, room):
        self.room = room

    def info(self, message):
        emit(events.GAME_NOTIFY, self.format('info', message), to=self.room)

    def success(self, message):
        emit(events.GAME_NOTIFY, self.format('success', message), to=self.room)

    def warn(self, message):
        emit(events.GAME_NOTIFY, self.format('warn', message), to=self.room)

    def error(self, message):
        emit(events.GAME_NOTIFY, self.format('error', message), to=self.room)

    def format(self, notification_type, message):
        return {'type': notification_type, 'message': str(message)}
