def parse_object_list(obj):
    return [o.__dict__ for o in obj]


def parse_game_state(state):
    (hands, remaining_cards, game_stack) = state

    parsed_hands = {
        'player_1': parse_object_list(hands['player_1']),
        'player_2': parse_object_list(hands['player_2']),
    }
    parsed_remaining_cards = parse_object_list(remaining_cards)
    parsed_game_stack = parse_object_list(game_stack)

    return {
        'hands': parsed_hands,
        'remaining_cards': parsed_remaining_cards,
        'game_stack': parsed_game_stack
    }