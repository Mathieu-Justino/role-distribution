from database import get_db
import random
import json

def create_initial_deck():
    """Creates and shuffles a full 17-policy deck for the start of a new game."""
    policy_deck = ['Fascist'] * 11 + ['Liberal'] * 6
    random.shuffle(policy_deck)
    return policy_deck

def ensure_deck_has_enough_cards(game_id):
    """
    Checks if the policy deck has at least 3 cards.
    If not, it reshuffles the discard pile to create a new deck.
    """
    db, c = get_db()
    c.execute("SELECT policy_deck, policy_discard FROM game_state WHERE game_id = ?", (game_id,))
    result = c.fetchone()
    
    if result is None:
        return # Or raise an error
    
    policy_deck_json, policy_discard_json = result
    policy_deck = json.loads(policy_deck_json)
    
    if len(policy_deck) < 3:
        policy_discard = json.loads(policy_discard_json)
        
        # Combine the old deck (if any) and the discard pile
        new_deck = policy_deck + policy_discard
        random.shuffle(new_deck)
        
        # Update the database with the new deck and an empty discard pile
        c.execute("UPDATE game_state SET policy_deck = ?, policy_discard = ? WHERE game_id = ?",
                  (json.dumps(new_deck), json.dumps([]), game_id))
        db.commit()
        
        return new_deck # Return the newly shuffled deck
    
    return policy_deck # Return the current deck if it's large enough

def draw_three_policies(game_id):
    """
    Draws three policies from the deck for the President.
    This function handles the reshuffle logic automatically.
    """
    policy_deck = ensure_deck_has_enough_cards(game_id)
    
    if policy_deck is None:
        return None # Game ID not found
        
    # Draw three policies from the deck
    drawn_policies = policy_deck[:3]
    remaining_deck = policy_deck[3:]
    
    # Update the database with the remaining deck
    db, c = get_db()
    c.execute("UPDATE game_state SET policy_deck = ? WHERE game_id = ?",
              (json.dumps(remaining_deck), game_id))
    db.commit()
    
    return drawn_policies