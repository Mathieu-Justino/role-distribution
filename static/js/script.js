var playerForm = document.getElementById("player-form");
if (playerForm) {
    playerForm.addEventListener("submit", generateDefaultValues);
}
function generateDefaultValues(event) {
    event.preventDefault();
    var playerInputs = playerForm.getElementsByTagName("input");
    for (var i = 0; i < playerInputs.length; i++) {
        if (playerInputs[i].value === "") {
            playerInputs[i].value = "Player " + (i + 1);
        }
    }
    playerForm.submit();
}


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

    fetch("/get-player-roles")
        .then(response => response.json())
        .then(data => {
            playerRoles.push(...data); // Add player roles to the array
            displayPlayerRole(playerRoles[currentRoleIndex]);
            currentRoleIndex++;
        })
        .catch(error => {
            console.error("Error:", error);
        });

    function displayPlayerRole(player) {
        playerRoleContainer.innerHTML = `<p>${player.name}: ${player.role}</p>`;
    }
});