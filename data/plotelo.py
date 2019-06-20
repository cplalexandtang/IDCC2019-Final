#!/usr/bin/python3

import matplotlib.pyplot as plt
import numpy as np
import base64
from io import BytesIO

import team

data = []
teams = team.teams()

with open("/media/cplalexandtang/Windows/Users/cplalexandtang/Desktop/NTU/IDCC2019-Final/data/mlb.csv") as file:
    for line in file.readlines()[:4000]:
        data.append(line[:-1].split(","))

fig = plt.figure(figsize=(16,10))
elos = []
for t in teams:
    elo = []
    for d in data:
        if d[4] == t:
            elo.append(float(d[6]))
        if len(elo) == 100: break
    plt.plot(np.arange(100), np.array(elo), label=t)

plt.grid(True)
plt.legend()

tmpfile = BytesIO()
fig.savefig(tmpfile, format='png')
encoded = base64.b64encode(tmpfile.getvalue())
strenc = str(encoded)[1:].replace("\'", "")

html = '<img class="img-fluid" alt="Responsive image" src="data:image/png;base64,{}">'.format(strenc)
print(html)
