import random


# def bill_roulette():
#    names = input("Enter all names, separated by a coma : ")
#    list_of_names = names.split(", ")
#    print(random.choice(list_of_names) + " is going to pay for the meal today !")


# bill_roulette()


def print_map(p_mapa):
    print("\n".join([' '.join(['{:2}'.format(item) for item in row]) for row in p_mapa]))


def golden_star():
    mapa = [["⬜️", "⬜️", "⬜️"], ["⬜️", "⬜️", "⬜️"], ["⬜️", "⬜️", "⬜️"]]
    print("This is our initial map...")
    print_map(mapa)

    horizontal = random.randint(0, 2)
    vertical = random.randint(0, 2)
    mapa[horizontal][vertical] = "⭐️"
    star_location = str(horizontal + 1) + str(vertical + 1)

    user_guess = input("What do you think: where is the Golden Star in the map?")

    if star_location == user_guess:
        print("Congratulations!!! You have found the Golden STAR!")
    else:
        user_horizont = int(user_guess[0])
        user_vertical = int(user_guess[1])
        mapa[user_horizont - 1][user_vertical - 1] = "🆇"
        print("Unfortunately you could find it 🙁")
    print_map(mapa)




golden_star()
