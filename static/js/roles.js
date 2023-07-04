document.addEventListener("DOMContentLoaded", function() {
    const playerRoles = []; // Array to store the player roles
    let currentRoleIndex = new URLSearchParams(window.location.search).get("index"); // Index of the current role to display

    const playerRoleContainer = document.getElementById("player-role");
    const nextButton = document.getElementById("next-button")    

    nextButton.addEventListener("click", function() {
        if ((currentRoleIndex) < playerRoles.length) {
            displayPlayerRole(playerRoles[currentRoleIndex]);
            currentRoleIndex++;
            window.location.href = "/roles-wait-screen";
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
        playerRoleContainer.innerHTML = `<p>${player[0]}: ${player[1]}</p>`;
    }
});