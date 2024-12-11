from flask import Blueprint, jsonify, request
import random
from python_app.player_class import player

lollipop_blueprint = Blueprint('lollipop', __name__)

combat_state = {}

def fight_step(fighter, enemy, action=None):
    global combat_state

    if action:
        damage = random.randint(*fighter["attacks"][action])
        enemy["health"] = max(0, enemy["health"] - damage)
        combat_state["last_action"] = f"You used {action}, dealing {damage} damage."
    else:
        attack = random.choice(list(enemy["attacks"].keys()))
        damage = random.randint(*enemy["attacks"][attack])
        fighter["health"] = max(0, fighter["health"] - damage)
        combat_state["last_action"] = f"Enemy used {attack}, dealing {damage} damage."

    combat_state["player_health"] = fighter["health"]
    combat_state["enemy_health"] = enemy["health"]

    if enemy["health"] <= 0:
        combat_state["result"] = "win"
        return combat_state
    if fighter["health"] <= 0:
        combat_state["result"] = "lose"
        return combat_state

    combat_state["result"] = "ongoing"
    return combat_state

def get_combatants(salvia_mode):
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

@lollipop_blueprint.route('/combat_step', methods=['POST'])
def combat_step():
    data = request.json
    action = data.get("action")
    salvia_mode = data.get("salvia_mode", False)

    global combat_state
    fighter, enemy = combat_state.get("fighter"), combat_state.get("enemy")

    if not fighter or not enemy:
        fighter, enemy = get_combatants(salvia_mode)
        combat_state.update({"fighter": fighter, "enemy": enemy})

    result = fight_step(fighter, enemy, action)

    if result["result"] == "win":
        return jsonify({"status": "win", "message": "Enemy defeated!", **result})
    elif result["result"] == "lose":
        player.death("Lost in a fight.")
        return jsonify({"status": "lose", "message": "You lost the fight!", **result})

    return jsonify({"status": "ongoing", **result})

@lollipop_blueprint.route('/api/balance', methods=['GET'])
def get_balance():
    return jsonify({"success": True, "balance": player.get_balance()})

@lollipop_blueprint.route('/ring_pop', methods=['GET'])
def ring_pop():
    try:
        random_bucks = random.randint(1, 1500)
        player.update_balance(random_bucks)
        return jsonify({"status": "success", "message": f"You got {random_bucks}€", "balance": player.get_balance()})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@lollipop_blueprint.route('/moomin', methods=['GET'])
def suck_moomin():
    try:
        decision = request.args.get('stop_sucking', 'false').lower() == 'true'
        if decision:
            return jsonify({"status": "success", "message": "You stopped sucking and avoided conflict."})
        else:
            fighter, enemy = get_combatants(salvia_mode=False)
            combat_state.update({"fighter": fighter, "enemy": enemy})
            return combat_step()
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@lollipop_blueprint.route('/jolly', methods=['GET'])
def suck_jolly():
    try:
        random_money = random.randint(100, 300)
        player.update_balance(random_money)
        return jsonify({"status": "success", "message": f"You received {random_money}€", "balance": player.get_balance()})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@lollipop_blueprint.route('/john', methods=['POST'])
def suck_john():
    try:
        accept_offer = request.json.get('accept_offer', False)
        if accept_offer:
            player.death("Lost while being stabbed in a back alley.")
            return jsonify({"status": "fail", "message": "You were stabbed in a back alley."})
        else:
            return jsonify({"status": "success", "message": "You denied the offer and survived."})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@lollipop_blueprint.route('/salvia', methods=['GET'])
def suck_salvia():
    try:
        fighter, enemy = get_combatants(salvia_mode=True)
        combat_state.update({"fighter": fighter, "enemy": enemy})
        return combat_step()
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@lollipop_blueprint.route('/chupa', methods=['GET'])
def suck_chupa():
    try:
        black_money = random.randint(500, 1000)
        player.update_balance(-black_money)
        return jsonify({"status": "fail", "message": f"You lost {black_money}€", "balance": player.get_balance()})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@lollipop_blueprint.route('/lollipop/select', methods=['POST'])
def lollipop_action():
    try:
        data = request.json  # Ensure JSON payload
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
        return jsonify({"status": "error", "message": f"Invalid lollipop choice: {lollipop_choice}"}), 400
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
