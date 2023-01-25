import random

word_list = ["trip", "nomad", "motorcycle", "highway"]

word = random.choice(word_list)
print(word)
blanks = []

for _ in range(len(word)):
    blanks.append("_")

print(blanks)

guess = input("Guess a letter: ").upper()