def parse_notification(notification_type, message):
    return {'type': notification_type, 'message': str(message)}


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
