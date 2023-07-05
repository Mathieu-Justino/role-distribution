from flask import Blueprint, flash, redirect, render_template, request, session, get_flashed_messages, jsonify
from database import get_db
import uuid
import datetime
from role_distribution import role_distribution

routes_bp = Blueprint("routes", __name__)


NUMBER_PLAYERS = list(range(5, 11))


@routes_bp.route("/")
def home():
    if "user_id" not in session:
        user_id = str(uuid.uuid4())  # Generate a random UUID
        session["user_id"] = user_id
    return render_template("home.html", active_page="home")


@routes_bp.route("/how-to-play")
def how_to_play():
    return render_template("how-to-play.html", active_page="how-to-play")


@routes_bp.route("/rules")
def rules():
    return render_template("rules.html", active_page="rules")


@routes_bp.route("/start-game", methods=["GET", "POST"])
def start_game():

    if request.method == "POST":
        
        no_players = request.form.get("number-players")

        try:
            no_players = int(no_players)
            if no_players not in NUMBER_PLAYERS:
                raise ValueError("Invalid number of players.")
        except:
            flash("Please select a valid number of players.", "error")
            return redirect("/start-game")

        db, c = get_db()
        game_id = str(uuid.uuid4())
        c.execute("INSERT INTO games (game_id, no_players) VALUES (?, ?)", (game_id, no_players))
        db.commit()

        session["game_id"] = game_id
        session["number_players"] = no_players
        
        return redirect("/player-names")

    else:

        flash_messages = get_flashed_messages(with_categories=True)
        return render_template("start-game.html", active_page="start-game", number_players=NUMBER_PLAYERS, flash_messages=flash_messages)


@routes_bp.route("/player-names", methods=["GET", "POST"])
def player_names():

    game_id = session.get("game_id")
    number_players = session.get("number_players")

    if game_id is None:
        flash("Number of players not defined", "error")
        return redirect("/start-game")
    if number_players is None:
        flash("Number of players not defined", "error")
        return redirect("/start-game")

    if request.method == "POST":
        player_names_and_id = []
        for i in range(number_players):
            player_id = str(uuid.uuid4())
            name = request.form.get(f"player{i+1}")
            current_timestamp = datetime.datetime.now()
            player_names_and_id.append((player_id, name, game_id, current_timestamp))

        for i in range(len(player_names_and_id)):
            for j in range(i + 1, len(player_names_and_id)):
                if player_names_and_id[i][1] == player_names_and_id[j][1]:
                    flash("Please enter unique player names.", "error")
                    return redirect("/player-names")
                
        db, c = get_db()
        c.executemany("INSERT INTO players (player_id, name, game_id, insertion_date) VALUES (?, ?, ?, ?)", player_names_and_id)
        current_timestamp = datetime.datetime.now()
        c.execute("INSERT INTO games (start_time) VALUES (?)", (current_timestamp,))
        db.commit()

        return redirect("/distribute-roles")

    else:
        flash_messages = get_flashed_messages(with_categories=True)
        return render_template("player-names.html", active_page="start-game", number_players=number_players, flash_messages=flash_messages)


@routes_bp.route("/distribute-roles")
def distribute_roles():

    game_id = session.get("game_id")
    number_players = session.get("number_players")

    role_distribution(game_id, number_players)

    return redirect("/roles-wait-screen")


@routes_bp.route("/get-player-roles")
def get_player_roles():

    game_id = session.get("game_id")
    number_players = session.get("number_players")

    db, c = get_db()
    c.execute("SELECT name, role FROM players WHERE game_id = ? ORDER BY insertion_date DESC LIMIT ?", (game_id, number_players))
    player_roles = c.fetchall()
    db.commit()

    return jsonify(player_roles)


@routes_bp.route("/show-player-roles")
def show_player_roles():
    return render_template('roles.html')


@routes_bp.route("/roles-wait-screen")
def roles_wait_screen():
    return render_template('roles-wait-screen.html')


@routes_bp.route("/game-arena")
def game_arena():
    return render_template('game-arena.html')
