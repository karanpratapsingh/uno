class Player:
    def __init__(self, name, room):
        self.name = name
        self.room = room
        self.online = True

    def __repr__(self):
        return f"Player(name={self.name})"

    def __hash__(self):
        return hash(self.name)

    def __eq__(self, obj):
        return isinstance(obj, type(self)) and self.name == obj.name
