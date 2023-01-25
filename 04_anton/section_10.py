# import math

# def numbers_divisible_by_five(list_of_numbers):
#    for number in list_of_numbers:
#        if number % 5 == 0:
#            print(number)
#        if number > 130:
#            print("STOP")
#            break


# list1 = [12, 15, 32, 40, 52, 75, 122, 132, 150, 180, 200]
# numbers_divisible_by_five(list1)


# def factorial(number):
#    factorial_of_number = 1
#    if number < 0:
#        return "Factorial does not exist for negative numbers"
#    else:
#        for value in range(1, number + 1):
#            factorial_of_number = factorial_of_number * value
#        return f"The factorial of {number} is {factorial_of_number}"


# answer = factorial(-1)
# print(answer)


# def entered_numbers():
#   total = 0
#   count = 0
#    while True:
#        value = input("Enter a number: ")
#        if value == "done":
#            break
#        try:
#            value = float(value)
#        except ValueError:
#            print("Error please enter numeric number: ")
#        else:
#            total += value
#            count += 1
#    if total != 0:
#        average = total / count
#    else:
#        average = 0
#    print(total, count, average)


# entered_numbers()


