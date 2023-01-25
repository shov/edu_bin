import random
import math


# def dice_rolling():
#    answer = "y"
#    while answer == "y":
#        dice_1 = random.randrange(1, 6)
#        dice_2 = random.randrange(1, 6)
#        print(f"Dice 1: {dice_1}", f"\nDice 2: {dice_2}")
#        answer = input("Would you like to roll again? y/n")


# dice_rolling()


# def fizz_buzz():
#    for number in range(1, 101):
#        if number % 5 == 0 and number % 7 == 0:
#            print("FizzBuzz")
#        elif number % 7 == 0:
#            print("Buzz")
#        elif number % 5 == 0:
#            print("Fizz")
#        else:
#            print(number)


# fizz_buzz()


# def guessing_the_number():
#    upper_bound = int(input("What max. number for the range ? "))
#    lower_bound = int(input("What min. number for the range ? "))
#    chances = round(math.log(upper_bound - lower_bound + 1, 2))
#    number = random.randrange(lower_bound, upper_bound)
#    print(f"You've only {chances} chances to guess the integer ")
#    count_answer = 0
#    while count_answer < chances:
#        answer = int(input("Guess the number: "))
#        count_answer += 1
#        if answer == number:
#            print(f"Congratulations you did it in {count_answer} try")
#            break
#        if answer < number:
#            print("You guessed too small")
#        if answer > number:
#            print("you guessed too high")
#        if count_answer == chances and answer != number:
#            print(f"The number is {number} \n Better Luck Next time")


# guessing_the_number()





# password_generator()


def rock_paper_and_scissors():
    list_items = ["rock", "paper", "scissors"]
    answer = "y"
    while answer == "y":
        user_choice = input("Enter a choice (" + ", ".join(list_items) + ") :")
        computer_choice = random.choice(list_items)
        print(f"You choose {user_choice}, computer choose {computer_choice}")
        if user_choice == computer_choice:
            answer = input("Nobody's won. Let's try again? y/n")
            continue
        elif user_choice == "rock":
            if computer_choice == "paper":
                print("Paper wins against rock! You lose!")
            if computer_choice == "scissors":
                print("Rock wins against scissors! You win!")
        elif user_choice == "paper":
            if computer_choice == "rock":
                print("Paper wins against rock! You win!")
            if computer_choice == "scissors":
                print("Scissors wins against paper.You lose!")
        elif user_choice == "scissors":
            if computer_choice == "paper":
                print("scissors wins against paper")
            if computer_choice == "rock":
                print("Rock wins against scissors! You lose!")
        answer = input("Let's try again? y/n")


rock_paper_and_scissors()
