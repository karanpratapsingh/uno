def parse_data_args(data, args):
    missing_args = []
    values = []

    for arg in args:
        if arg not in data:
            missing_args.append(arg)
        else:
            values.append(data[arg])

    if missing_args != []:
        raise Exception(f'missing args: {", ".join(missing_args)}')

    return values


def parse_object_list(objects):
    return [obj.__dict__ for obj in list(objects)]


def parse_game_state(state):
    (hands, remaining_cards, game_stack) = state
    parsed_hands = {key.id: parse_object_list(
        value) for key, value in hands.items()}

    parsed_remaining_cards = parse_object_list(remaining_cards)
    parsed_game_stack = parse_object_list(game_stack)

    return {
        'hands': parsed_hands,
        'remaining_cards': parsed_remaining_cards,
        'game_stack': parsed_game_stack
    }
