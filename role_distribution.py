from database import get_db
import random


def role_distribution(game_id, number_players):
    db, c = get_db()
    number_players = int(number_players)

    def assign_role(roles, players):
        for i in range(len(players)):
            player_id = players[i][0]
            role = roles[i]
            if role == "Fascist" or role == "Hitler":
                faction = "Fascist"
            else:
                faction = "Liberal"
            c.execute("UPDATE players SET role = ?, faction = ? WHERE player_id = ?", (role, faction, player_id))

    c.execute("SELECT player_id FROM players WHERE game_id = ? ORDER BY insertion_date DESC LIMIT ?", (game_id, number_players))
    players = c.fetchall()

    random.shuffle(players)

    if number_players == 5:
        roles = ["Liberal", "Liberal", "Liberal", "Fascist", "Hitler"]
        assign_role(roles, players)

    elif number_players == 6:
        roles = ["Liberal", "Liberal", "Liberal", "Liberal", "Fascist", "Hitler"]
        assign_role(roles, players)
        
    elif number_players == 7:
        roles = ["Liberal", "Liberal", "Liberal", "Liberal", "Fascist", "Fascist", "Hitler"]
        assign_role(roles, players)
        
    elif number_players == 8:
        roles = ["Liberal", "Liberal", "Liberal", "Liberal", "Liberal", "Fascist", "Fascist", "Hitler"]
        assign_role(roles, players)
        
    elif number_players == 9:
        roles = ["Liberal", "Liberal", "Liberal", "Liberal", "Liberal", "Fascist", "Fascist", "Fascist", "Hitler"]
        assign_role(roles, players)
        
    elif number_players == 10:
        roles = ["Liberal", "Liberal", "Liberal", "Liberal", "Liberal", "Liberal", "Fascist", "Fascist", "Fascist", "Hitler"]
        assign_role(roles, players)

    db.commit()

