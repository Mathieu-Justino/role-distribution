document.addEventListener("DOMContentLoaded", function() {
    const playerRoles = []; // Array to store the player roles
    let currentRoleIndex = 0; // Index of the current role to display

    const playerRoleContainer = document.getElementById("player-role");
    const nextButton = document.getElementById("next-button");

    nextButton.addEventListener("click", function() {
        if (currentRoleIndex < playerRoles.length) {
            displayPlayerRole(playerRoles[currentRoleIndex]);
            currentRoleIndex++;
        }
    });

    console.log("Before fetch");
    fetch("/get-player-roles")
        .then(response => response.json())
        .then(data => {
            console.log("Received data:", data);
            playerRoles.push(...data); // Add player roles to the array
            console.log("Player roles array:", playerRoles);
            displayPlayerRole(playerRoles[currentRoleIndex]);
            currentRoleIndex++;
        })
        .catch(error => {
            console.error("Error:", error);
        });

    function displayPlayerRole(player) {
        console.log("Displaying player role:", player);
        playerRoleContainer.innerHTML = `<p>${player[0]}: ${player[1]}</p>`;
    }
});