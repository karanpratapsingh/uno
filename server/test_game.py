from uno import Game
from player import Player


def test_game():
    p1 = Player("abc")
    p2 = Player("xyz")

    game = Game([p1, p2], 7)
    game.draw(p1.id)
    hands, remaining_cards, game_stack = game.get_state()
    p1_cards = hands[p1]
    game.play_card(p1.id, p1_cards[0].id)
    hands, remaining_cards, game_stack = game.get_state()
    assert len(game_stack) == 2


if __name__ == "__main__":
    test_game()
