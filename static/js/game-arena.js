document.addEventListener("DOMContentLoaded", function() {

    const players = [];

    fetch("/get-player-roles-factions/" + gameId)
        // Get JSON data
        .then(response => response.json())
        .then(data => {
            players.push(...data); 
            console.log(players)

            const tableBody = document.getElementById("player-table-body");
    
            players.forEach(player => {
                const tableRow = document.createElement("tr");
    
                const nameCell = document.createElement("td");
                nameCell.textContent = player[0];
    
                const buttonCellReveal = document.createElement("td");
                const buttonFaction = document.createElement("button");
                const buttonRole = document.createElement("button");

                buttonFaction.textContent = "Reveal Party Membership";
                buttonRole.textContent = "Reveal Secret Role";
            
                const modal = document.getElementById("modal");
                const role = document.getElementById("role");
                const close = document.getElementById("close");

                // Create popup when user wants to reveal role or party membership
                buttonFaction.addEventListener("click", () => {
                    modal.style.display = "block";
                    role.textContent = `${player[0]} is a ${player[1]}`;
                });
                buttonRole.addEventListener("click", () => {
                    modal.style.display = "block";
                    role.textContent = `${player[0]}'s secret role is ${player[2]}`;
                });
                close.addEventListener("click", () => {
                    modal.style.display = "none";
                });

                // Create table 
                buttonCellReveal.append(buttonFaction, " ", buttonRole);
    
                tableRow.appendChild(nameCell);
                tableRow.appendChild(buttonCellReveal);
    
                tableBody.appendChild(tableRow);
            });
        })
        .catch(error => {
            console.error("Error:", error);
        });
});

function showPolicySelection(gameId, policies, isPresident) {
    const container = document.getElementById("policy-selection-container");
    const statement = document.getElementById("policy-selection-statement");
    const presidentArea = document.getElementById("presidents-policy-area");
    const chancellorArea = document.getElementById("chancellors-policy-area");

    container.style.display = 'block';

    if (isPresident) {
        statement.textContent = "You are the President. Select a policy to discard.";
        presidentArea.style.display = 'block';
        chancellorArea.style.display = 'none';
        displayPolicies(policies, 'presidents-policies', handlePresidentDiscard);
    } else {
        statement.textContent = "You are the Chancellor. Select a policy to enact.";
        presidentArea.style.display = 'none';
        chancellorArea.style.display = 'block';
        displayPolicies(policies, 'chancellors-policies', handleChancellorEnact);
    }
}

// A helper function to create and append policy cards to the UI
function displayPolicies(policies, containerId, clickHandler) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Clear previous policies
    
    policies.forEach(policy => {
        const policyCard = document.createElement('div');
        policyCard.className = 'policy-card ' + (policy === 'Fascist' ? 'fascist' : 'liberal');
        policyCard.textContent = policy;
        policyCard.addEventListener('click', () => clickHandler(policy));
        container.appendChild(policyCard);
    });
}



function startElection(gameId, presidentId) {
    // 1. Fetch player names to populate the chancellor list.
    fetch(`/get-player-roles/${gameId}`)
        .then(response => response.json())
        .then(players => {
            const presidentName = players.find(p => p[0] === presidentId)[0];
            document.getElementById("president-name").textContent = `President: ${presidentName}`;

            const chancellorList = document.getElementById("chancellor-list");
            chancellorList.innerHTML = "";
            
            // 2. Populate the list of potential Chancellors
            players.forEach(player => {
                if (player[0] !== presidentName) { // The President can't be Chancellor
                    const li = document.createElement("li");
                    li.textContent = player[0];
                    li.addEventListener("click", () => handleChancellorSelection(gameId, player[0]));
                    chancellorList.appendChild(li);
                }
            });
            document.getElementById("chancellor-selection").style.display = "block";
        });
}

// 3. Handle the Chancellor selection and send it to the server.
function handleChancellorSelection(gameId, chancellorName) {
    // In a real implementation, you would use player_id, not name.
    // For this example, we'll assume the name is unique.
    fetch(`/select-chancellor/${gameId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_chancellor_name: chancellorName })
    })
    .then(response => response.json())
    .then(data => {
        // Hide the selection list and show the vote result box
        document.getElementById("chancellor-selection").style.display = "none";
        document.getElementById("vote-result-container").style.display = "block";
    });
}



let currentPolicies = []; // This will hold the 3 policies drawn by the President

function handlePresidentDiscard(discardedPolicy) {
    // Send the discarded policy to the server
    const remainingPolicies = currentPolicies.filter(p => p !== discardedPolicy);
    
    fetch(`/president-discards/${gameId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ remaining_policies: remainingPolicies })
    })
    .then(response => response.json())
    .then(data => {
        // Hide the President's policy selection area
        document.getElementById('presidents-policy-area').style.display = 'none';
        
        // This is where you would update the UI for the Chancellor
        // This logic will be triggered by a game state change fetched from the server.
    });
}

function handleChancellorEnact(enactedPolicy) {
    // Send the enacted policy to the server
    const discardedPolicy = currentPolicies.find(p => p !== enactedPolicy);
    
    fetch(`/chancellor-enacts/${gameId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enacted_policy: enactedPolicy, discarded_policy: discardedPolicy })
    })
    .then(response => response.json())
    .then(data => {
        // Update the game board with the new policy and move to the next turn
        // This logic will also be triggered by a game state change fetched from the server.
    });
}