# def sum_of_two_digits():
#    number = input("Enter two digits number: ")
#    number_1 = int(number[0])
#    number_2 = int(number[1])
#    summa = number_1 + number_2
#    return summa


# answer = sum_of_two_digits()
# print(answer)


# def backward_traversal():
#    word = input("Enter any word: ")
#    count_char = len(word)
#    while count_char > 0:
#        print(word[count_char-1])
#        count_char -= 1


# backward_traversal()


# def sum_of_digits():
#    number = input("Enter an integer number: ")
#    sum_digits = 0
#    for char in number:
#        sum_digits += int(char)
#    return sum_digits


# answer = sum_of_digits()
# print(answer)


# def count_characters_in_a_string(word, letter):
#    count_letter = 0
#    for char in word:
#        if char == letter:
#            count_letter += 1
#    return count_letter


# answer = count_characters_in_a_string("nomad tenix", "n")
# print(answer)


# def replace_character():
#    custom_string = "I love Python."
#    new_line = custom_string.replace(".", "!")
#    print(custom_string, "\n", new_line)


# replace_character()


# def string_format():
#    custom_string = "X-MAPDS-Confidence:0.8475"
#    start_index = custom_string.find(":") + 1
#    end_index = len(custom_string)
#    result = custom_string[start_index: end_index]
#    result = float(result)
#    print(result, "\n", type(result))


# string_format()


# def print_pattern(number_of_stars):
#    for i in range(0, number_of_stars):
#        for n in range(0, i + 1):
#            print("*", end=" ")
#        print()
#    for i in range(number_of_stars, 0, -1):
#        for n in range(0, i - 1):
#            print("*", end=" ")
#        print()


# print_pattern(7)


def string_formatting():
    names = ['John', 'Edy', 'Jane', 'Kane']
    scores = [90, 95, 80, 75]
    print("{0:<10} {1:<5}".format("Name", "Score"))
    for i in range(len(names)):
        name = names[i]
        score = scores[i]
        print("{0:<10} {1:<5}".format(name, score))



string_formatting()
