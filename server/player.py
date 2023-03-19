class Player:
    def __init__(self, username, room):
        self.username = username
        self.room = room
        self.online = True

    def __repr__(self):
        return f"User(username={self.username})"

    def __hash__(self):
        return hash(self.username)

    def __eq__(self, obj):
        return isinstance(obj, type(self)) and self.username == obj.username
