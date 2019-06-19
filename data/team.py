teams = []

with open("mlb_elo_headless.csv") as file:
    for line in file.readlines()[:2464]:
        line = line[:-1].split(",")
        teams.append(line[4])
        teams.append(line[5])

print(list(set(teams)))