#!/usr/bin/python3

import time
import sys

data = []
newdata = []

if len(sys.argv) < 2:
    print("Usage: run or clear or test")
    exit(1)

if sys.argv[1][0] == "r" or sys.argv[1][0] == "t":
    with open("mlb_elo_headless.csv") as file:
        for line in file.readlines():
            data.append(line[:-1])

    with open("new_data.csv") as file:
        for line in file.readlines():
            newdata.append(line[:-1])

    with open("mlb.csv", "w") as file:
        for line in data:
            file.write(line + "\n")

    if sys.argv[1][0] == "r":
        for i in range(len(newdata)-1, 0, -1):
            file = open("mlb.csv", "r+")
            content = file.read()
            file.seek(0, 0)
            file.write(newdata[i] + '\n' + content)
            file.close()
            time.sleep(3)

elif sys.argv[1][0] == "c":
    with open("mlb.csv", "w") as file:
        file.write("")
else:
    print("Usage: run or clear or test")
    exit(1)
