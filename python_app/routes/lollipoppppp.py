import random
from flask import Blueprint, jsonify, request
from python_app.player_class import create_player_object, player

# Define a Flask Blueprint
lollipop_blueprint = Blueprint('lollipop', __name__)

@lollipop_blueprint.route('/api/balance', methods=['GET'])
def get_balance():
    """Returns the player's current balance."""
    from python_app.player_class import player  # Ensure player instance is accessible
    try:
        current_balance = player.get_balance()  # Call the new get_balance method
        return jsonify({"success": True, "balance": current_balance})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# Helper functions
def fight(fighter, enemy):
    """Simulate a turn-based fight between fighter and enemy."""
    while fighter["health"] > 0 and enemy["health"] > 0:
        turn = random.choice(["player", "enemy"])

        if turn == "player":
            attack = random.choice(list(fighter["attacks"].keys()))
            damage = random.randint(*fighter["attacks"][attack])
            enemy["health"] = max(0, enemy["health"] - damage)
        else:
            attack = random.choice(list(enemy["attacks"].keys()))
            damage = random.randint(*enemy["attacks"][attack])
            fighter["health"] = max(0, fighter["health"] - damage)

        if enemy["health"] <= 0:
            return "win"
        if fighter["health"] <= 0:
            return "lose"

def get_combatants(salvia_mode):
    """Initialize fighter and enemy stats."""
    fighter = {
        "name": "Player",
        "health": 100,
        "attacks": {
            "Lollipop eye poke": (10, 20),
            "Lollipop throw": (15, 25),
            "Nut cracker": (20, 35)
        }
    }
    enemy = {
        "name": "Enemy",
        "health": 100,
        "attacks": {
            "Pop Bite": (8, 18),
            "Claw": (12, 25),
            "Crotch grab": (18, 30)
        }
    }

    if salvia_mode:
        fighter["attacks"] = {
            "Moomin punch": (15, 30),
            "Chupa kick": (20, 40),
            "Sugar rage": (25, 50)
        }
        enemy.update(name="Lollipop hater", health=80)

    return fighter, enemy


# Routes
@lollipop_blueprint.route('/start_fight', methods=['GET'])
def start_fight():
    salvia_mode = request.args.get('salvia_mode', 'false').lower() == 'true'
    fighter, enemy = get_combatants(salvia_mode)
    result = fight(fighter, enemy)

    if result == "win":
        return jsonify({"status": "success", "message": "Enemy defeated!"})
    else:
        player.death("Lost in a fight.")
        return jsonify({"status": "fail", "message": "You lost the fight!"})


@lollipop_blueprint.route('/ring_pop', methods=['GET'])
def ring_pop():
    random_bucks = random.randint(1, 1500)
    player.update_balance(random_bucks)
    return jsonify({"status": "success", "message": f"You got {random_bucks}€"})


@lollipop_blueprint.route('/moomin', methods=['GET'])
def suck_moomin():
    decision = request.args.get('stop_sucking', 'false').lower() == 'true'
    if decision:
        return jsonify({"status": "success", "message": "You stopped sucking and avoided conflict."})
    else:
        result = start_fight()
        if result["status"] == "fail":
            player.death("Lost over sucking a lollipop.")
        return jsonify(result)


@lollipop_blueprint.route('/jolly', methods=['GET'])
def suck_jolly():
    random_money = random.randint(100, 300)
    player.update_balance(random_money)
    return jsonify({"status": "success", "message": f"You received {random_money}€"})


@lollipop_blueprint.route('/john', methods=['POST'])
def suck_john():
    accept_offer = request.json.get('accept_offer', False)
    if accept_offer:
        player.death("Lost while being stabbed in a back alley.")
        return jsonify({"status": "fail", "message": "You were stabbed in a back alley."})
    else:
        return jsonify({"status": "success", "message": "You denied the offer and survived."})


@lollipop_blueprint.route('/salvia', methods=['GET'])
def suck_salvia():
    result = start_fight(salvia_mode=True)
    if result["status"] == "fail":
        player.death("Lost while being sugar high.")
    return jsonify(result)


@lollipop_blueprint.route('/chupa', methods=['GET'])
def suck_chupa():
    black_money = random.randint(500, 1000)
    player.update_balance(-black_money)
    return jsonify({"status": "fail", "message": f"You lost {black_money}€"})


@lollipop_blueprint.route('/lollipop/select', methods=['POST'])
def lollipop_action():
    """Handles lollipop selection and actions."""
    data = request.json
    lollipop_choice = data.get('lollipop', '').upper()

    actions = {
        "RINGPOP": ring_pop,
        "MOOMIN": suck_moomin,
        "JOLLY RANCHER": suck_jolly,
        "JOHN PLAYER SPECIAL": suck_john,
        "SALVIA POP": suck_salvia,
        "CHUPACHUPS": suck_chupa
    }

    if lollipop_choice in actions:
        return actions[lollipop_choice]()
    return jsonify({"status": "error", "message": "Invalid lollipop choice."}), 400

