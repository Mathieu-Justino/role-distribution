document.addEventListener("DOMContentLoaded", function() {
    const playerRoles = []; // Array to store the player roles
    let currentRoleIndex = sessionStorage.getItem("currentRoleIndex") || 0; // Retrieve currentRoleIndex from session storage, or set it to 0

    const playerRoleContainer = document.getElementById("player-role");
    const playerNameContainer = document.getElementById("player-name");
    const alliesNamesContainer = document.getElementById("allies-roles");
    const nextButton = document.getElementById("next-button");
    const revealButton = document.getElementById("reveal-button");
    const resetButton = document.getElementById("reset-roles");
    const quitButton = document.getElementById("quit-button");


    function displayPlayerRole(player) {
        playerRoleContainer.innerHTML = `<p>${player[0]}: ${player[1]}</p>`;
        
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
        
        if (playerRoles.length < 7 && (player[1] == "Fascist" || player[1] == "Hitler")) {
            alliesNamesContainer.innerHTML = "";
            for (let i = 0; i < fascistAndHitlerNames.length; i++) {
                if (player[0] != fascistAndHitlerNames[i][0])
                    alliesNamesContainer.innerHTML += `<p>${fascistAndHitlerNames[i]}</p>`;
            }
        }

        if (playerRoles.length >= 7 && player[1] == "Fascist") {
            alliesNamesContainer.innerHTML = "";
            for (let i = 0; i < fascistAndHitlerNames.length; i++) {
                if (player[0] != fascistAndHitlerNames[i][0])
                    alliesNamesContainer.innerHTML += `<p>${fascistAndHitlerNames[i]}</p>`;
            }
        }
    }

    function displayPlayerName(player) {
        playerNameContainer.innerHTML = `<p>${player[0]}, are you ready to see your role?</p>`;
    }

    if (nextButton) {
        nextButton.addEventListener("click", function() {
            if (Number(currentRoleIndex) + 1 < playerRoles.length) {
                displayPlayerRole(playerRoles[currentRoleIndex]);
                currentRoleIndex++;
                sessionStorage.setItem("currentRoleIndex", currentRoleIndex); // Store updated currentRoleIndex in session storage
                window.location.href = "/roles-wait-screen";
            } else {
                sessionStorage.removeItem("currentRoleIndex");
                window.location.href = "/game-arena";
            }
        });
    }

    if (revealButton) {
        revealButton.addEventListener("click", function() {
            if (currentRoleIndex < playerRoles.length) {
                displayPlayerName(playerRoles[currentRoleIndex]);
                window.location.href = "/show-player-roles";
            }
        });
    }

    resetButton.addEventListener("click", function() {
        if (currentRoleIndex < playerRoles.length) {
            sessionStorage.removeItem("currentRoleIndex");
            window.location.href = "/distribute-roles";
        }
    });

    quitButton.addEventListener("click", function() {
        if (currentRoleIndex < playerRoles.length) {
            sessionStorage.removeItem("currentRoleIndex");
            window.location.href = "/";
        }
    });


    fetch("/get-player-roles")
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