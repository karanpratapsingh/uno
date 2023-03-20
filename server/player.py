class Player:
    def __init__(self, name):
        self.id = f'player-{name}'
        self.name = name
        self.online = True

    def __repr__(self):
        return f"Player(id={self.id}, name={self.name})"

    def __hash__(self):
        return hash(self.id)

    def __eq__(self, obj):
        return isinstance(obj, type(self)) and self.id == obj.id
