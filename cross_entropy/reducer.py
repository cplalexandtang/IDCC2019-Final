#!/usr/bin/python3

import sys

prekey, prevalue, count = None, 0, 0
for line in sys.stdin:
    key, value = line[:-1].split("\t")
    value = float(value)
    if key == prekey:
        prevalue += value
        count += 1
    else:
        if prekey: print("{} {}".format(prekey, prevalue/count))
        prevalue = value
        prekey = key
        count = 1

if prekey == key: print("{} {}".format(prekey, prevalue/count))