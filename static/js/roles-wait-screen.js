document.addEventListener("DOMContentLoaded", function() {
    const playerNameContainer = document.getElementById("player-name");
    const revealButton = document.getElementById("reveal-button");

    const playerRoles = []; // Array to store the player roles
    let currentRoleIndex = 0; // Index of the current role to display

    revealButton.addEventListener("click", function() {
        if (currentRoleIndex < playerRoles.length) {
            displayPlayerName(playerRoles[currentRoleIndex]);
            currentRoleIndex++;
            window.location.href = "/show-player-roles";
        }
    });

    fetch("/get-player-roles")
        .then(response => response.json())
        .then(data => {
            playerRoles.push(...data); // Add player roles to the array
            displayPlayerName(playerRoles[currentRoleIndex]);
            currentRoleIndex++;
        })
        .catch(error => {
            console.error("Error:", error);
        });

    function displayPlayerName(player) {
        playerNameContainer.innerHTML = `<p>${player[0]}, Are you ready to see your role?</p>`;
    }
});