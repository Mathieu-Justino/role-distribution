// This function takes care of the displaying of all player roles

document.addEventListener("DOMContentLoaded", function() {
    const playerRoles = []; // Array to store the player roles

    // this counter keeps track of where in the role distribution the user is currently situated and keeps it in session storage (to prevent from going back or accidental refreshes)
    let currentRoleIndex = sessionStorage.getItem("currentRoleIndex") || 0; 

    const playerRoleContainer = document.getElementById("player-role");
    const playerNameContainer = document.getElementById("player-name");
    const alliesNamesContainer = document.getElementById("allies-roles");
    const nextButton = document.getElementById("next-button");
    const revealButton = document.getElementById("reveal-button");
    const resetButton = document.getElementById("reset-roles");
    const allyStatementContainer = document.getElementById("ally-statement");


    function displayPlayerRole(player) {

        let roleClass = '';

        if (player[1] === "Liberal") {
            roleClass = 'liberal-role';
        } else if (player[1] === "Fascist" || player[1] === "Hitler") {
            roleClass = 'fascist-role';
        }

        playerRoleContainer.innerHTML = `<p>${player[0]}, your Secret Role is <strong class="${roleClass}">${player[1]}</strong></p>`;
        
        // This function stores who are the Fascists and Hitler, to then display them to their allies
        const fascistAndHitlerNames = [];
        for (let i = 0; i < playerRoles.length; i++) {
            const role = playerRoles[i][1];
            if (role == "Fascist" || role == "Hitler") {
                const name = playerRoles[i];
                fascistAndHitlerNames.push(name);
            }
        }
        console.log("Allies:", fascistAndHitlerNames);
        console.log("Ally:", fascistAndHitlerNames[0]);
        

        // Here, we take care of the two different scenarios where Hitler can see his allies when there are 5 or 6 players, and can't when there are more
        if (playerRoles.length < 7 && (player[1] == "Fascist" || player[1] == "Hitler")) {
            alliesNamesContainer.innerHTML = "";
            allyStatementContainer.innerHTML = "Your allies are:"
            for (let i = 0; i < fascistAndHitlerNames.length; i++) {
                if (player[0] != fascistAndHitlerNames[i][0])
                    alliesNamesContainer.innerHTML += `<p>${fascistAndHitlerNames[i][0]}: <strong class="fascist-role">${fascistAndHitlerNames[i][1]}</strong></p>`;
            }
        }
        if (playerRoles.length >= 7 && player[1] == "Fascist") {
            alliesNamesContainer.innerHTML = "";
            allyStatementContainer.innerHTML = "Your allies are:"
            for (let i = 0; i < fascistAndHitlerNames.length; i++) {
                if (player[0] != fascistAndHitlerNames[i][0])
                    alliesNamesContainer.innerHTML += `<p>${fascistAndHitlerNames[i][0]}: <strong class="fascist-role">${fascistAndHitlerNames[i][1]}</strong></p>`;
            }
        }
    }

    function displayPlayerName(player) {
        playerNameContainer.innerHTML = `<p>${player[0]}, are you ready to see your role?</p>`;
    }

    // The next button is used when the player has seen his role, it goes on to the wait screen for the next player
    if (nextButton) {
        nextButton.addEventListener("click", function() {
            if (Number(currentRoleIndex) + 1 < playerRoles.length) {
                displayPlayerRole(playerRoles[currentRoleIndex]);
                currentRoleIndex++;
                sessionStorage.setItem("currentRoleIndex", currentRoleIndex); // Store updated currentRoleIndex in session storage
                window.location.href = "/roles-wait-screen/" + gameId;
            } else {
                sessionStorage.removeItem("currentRoleIndex");
                window.location.href = "/game-arena/" + gameId;
            }
        });
    }

    // The reveal button is used when the player wants to see his role
    if (revealButton) {
        revealButton.addEventListener("click", function() {
            if (currentRoleIndex < playerRoles.length) {
                displayPlayerName(playerRoles[currentRoleIndex]);
                window.location.href = "/show-player-roles/" + gameId;
            }
        });
    }

    // The reset button is available throughout the role distribution phase, it is used to reshuffle the roles without inputting 
    resetButton.addEventListener("click", function() {
        sessionStorage.removeItem("currentRoleIndex");
        window.location.href = "/distribute-roles/" + gameId;
    });


    // Here we fetch the JSON with the role data
    fetch("/get-player-roles/" + gameId)
        .then(response => response.json())
        .then(data => {
            playerRoles.push(...data); // Add player roles to the array
            console.log(playerRoles.length);
            console.log(playerRoles)
            console.log(currentRoleIndex)
            if (nextButton && playerRoles.length > 0) {
                displayPlayerRole(playerRoles[currentRoleIndex]);
            }
            if (revealButton && playerRoles.length > 0) {
                displayPlayerName(playerRoles[currentRoleIndex]);
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
});