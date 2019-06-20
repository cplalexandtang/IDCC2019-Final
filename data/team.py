def teams():
    teams = []

    with open("/media/cplalexandtang/Windows/Users/cplalexandtang/Desktop/NTU/IDCC2019-Final/data/mlb_elo_headless.csv") as file:
        for line in file.readlines()[:2464]:
            line = line[:-1].split(",")
            teams.append(line[4])
            teams.append(line[5])

    return list(set(teams))
    #print(list(set(teams)))

def table():
    t = teams()
    '''print("<table>")
    print("<tr>")
    print("  <th>Home/Away</th>")
    for away in t:
        print('  <th>{}</th>'.format(away))
    print("</tr>")
    for home in t:
        print("<tr>")
        print("  <td>{}</td>".format(home))
        for away in t:
            print('  <td id="{}" class="{}">0</td>'.format(home, away))
        print("</tr>")
    print("</table>")'''

table()