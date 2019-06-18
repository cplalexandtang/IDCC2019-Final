#!/usr/bin/python3

import sys

prekey, prevalue = 0, 0
for line in sys.stdin:
    key, value = line[:-1].split("\t")
    key, value = int(key), int(value)
    if key == prekey:
        prevalue += value
    else:
        if prevalue: print("{} {}".format(prekey, prevalue))
        prevalue = value
        prekey = key

if prekey == key: print("{} {}".format(prekey, prevalue))