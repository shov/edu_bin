import sys
import random

HEARTS = chr(9829)
DIAMONDS = chr(9830)
SPADES = chr(9824)
CLUBS = chr(9827)

BACKSIDE = 'backside'

print("Welcome to BlackJack!")
money = 5000


def get_bet(max_bet):
    while True:
        print("How much do you want to bet? (1-{}, or QUIT)".format(max_bet))
        bet = input('>').upper().strip()
        if bet == 'QUIT':
            print('Thanks for the game!')
            sys.exit()
        if not bet.isdecimal():
            continue
        bet = int(bet)
        if 1 <= bet <= max_bet:
            return bet


def get_deck():
    deck = []
    for suit in (HEARTS, DIAMONDS, SPADES, CLUBS):
        for rank in range(2, 11):
            deck.append((str(rank), suit))
        for rank in ('J', 'Q', 'K', 'A'):
            deck.append((rank, suit))
    random.shuffle(deck)
    return deck


def display_cards(cards):
    rows = ['', '', '', '']
    for card in cards:
        rows[0] += ' ___  '
        if card == BACKSIDE:
            rows[1] += '|## | '
            rows[2] += '|###| '
            rows[3] += '|_##| '
        else:
            rank, suit = card
            rows[1] += '|{} | '.format(rank.ljust(2))
            rows[2] += '| {} | '.format(suit)
            rows[3] += '|_{}| '.format(rank.rjust(2, '_'))
    for row in rows:
        print(row)


def get_hand_value(cards):
    value = 0
    number_of_aces = 0
    for card in cards:
        rank = card[0]
        if rank == 'A':
            number_of_aces += 1
        elif rank in ('K', 'J', 'Q'):
            value += 10
        else:
            value += int(rank)
    value += number_of_aces
    for i in range(number_of_aces):
        if value + 10 <= 21:
            value += 10
    return value


def display_hands(player_hand, dealer_hand, show_dealer_hand):
    print()
    if show_dealer_hand:
        print('DEALER', get_hand_value(dealer_hand))
        display_cards(dealer_hand)
    else:
        print('DEALER: ?')
        display_cards([BACKSIDE] + dealer_hand[1:])
    print('PLAYER:', get_hand_value(player_hand))
    display_cards(player_hand)


def get_move(player_hand, money):
    while True:
        moves = ['(H)it', '(S)tand']
        if len(player_hand) == 2 and money > 0:
            moves.append('(D)ouble down')
        move_prompt = ', '.join(moves) + '>'
        move = input(move_prompt).upper()
        if move in ('H', 'S'):
            return move
        if move == 'D' and '(D)ouble down' in moves:
            return move


while True:
    if money <= 0:
        print("You don't have enough money for continue game!")
        sys.exit()
    print('Money: ', money)
    bet = get_bet(money)
    deck = get_deck()
    dealer_hand = [deck.pop(), deck.pop()]
    player_hand = [deck.pop(), deck.pop()]
    print('Bet:', bet)
    while True:
        display_hands(player_hand, dealer_hand, False)
        print()
        if get_hand_value(player_hand) > 21:
            break
        move = get_move(player_hand, money - bet)
        if move == 'D':
            additional_bet = get_bet(min(bet, (money - bet)))
            bet += additional_bet
            print('Bet increased to {}.'.format(bet))
            print('Bet:', bet)
        if move in ('H', 'D'):
            new_card = deck.pop()
            rank, suit = new_card
            print(f'You drew a {rank} of {suit}.')
            player_hand.append(new_card)
            if get_hand_value(player_hand) > 21:
                continue
        if move == 'S':
            break
    if get_hand_value(player_hand) <= 21:
        while get_hand_value(dealer_hand) < 17:
            print("The dealer hits")
            dealer_hand.append(deck.pop())
            display_hands(player_hand, dealer_hand, False)
            if get_hand_value(dealer_hand) > 21:
                break
            input('Press enter to continue...')
            print('\n\n')

    display_hands(player_hand, dealer_hand, True)
    player_value = get_hand_value(player_hand)
    dealer_value = get_hand_value(dealer_hand)

    if dealer_value > 21:
        print(f'Dealer busts! You win ${bet}!')
        money += bet
    elif player_value > 21 or player_value < dealer_value:
        print('You lost!')
        money -= bet
    elif player_value > dealer_value:
        print(f'You win ${bet}!')
        money += bet
    elif player_value == dealer_value:
        print('It is a draw bet returned to you!')
    input('Press enter to continue')
    print('\n\n')
