#!/usr/bin/python3

import sys
import numpy as np
import datetime

for line in sys.stdin:
    line = line[:-1].split(",")
    time = datetime.datetime.strptime(line[0], "%Y-%m-%d")
    delta = (datetime.datetime.now() - time).days

    key = line[4] + line[5]
    
    p_true = float(line[-2] > line[-1])
    p_pred = float(line[8])
    
    value = ( - (p_true * np.log2(p_pred)) - ((1-p_true) * np.log2((1 - p_pred)))) * np.power(1/delta, 0.25)
    print("{}\t{}".format(key, value))