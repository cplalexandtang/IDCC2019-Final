#!/usr/bin/python3

import sys

for line in sys.stdin:
    line = line[:-1].split(",")
    fact = int(line[-2]) > int(line[-1])
    pred = float(line[8]) > float(line[9])
    print("{}\t{}".format(int(fact)*2 + int(pred), 1))