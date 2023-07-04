document.addEventListener("DOMContentLoaded", function() {
    const playerRoles = []; // Array to store the player roles
    let currentRoleIndex = sessionStorage.getItem("currentRoleIndex") || 0; // Retrieve currentRoleIndex from session storage, or set it to 0

    const playerRoleContainer = document.getElementById("player-role");
    const playerNameContainer = document.getElementById("player-name");
    const nextButton = document.getElementById("next-button");
    const revealButton = document.getElementById("reveal-button");
    const resetButton = document.getElementById("reset-roles");


    function displayPlayerRole(player) {
        playerRoleContainer.innerHTML = `<p>${player[0]}: ${player[1]}</p>`;
    }

    function displayPlayerName(player) {
        console.log(player)
        playerNameContainer.innerHTML = `<p>${player[0]}, Are you ready to see your role?</p>`;
    }

    if (nextButton) {
        nextButton.addEventListener("click", function() {
            console.log("length:", playerRoles.length);
            console.log("array:", playerRoles);
            console.log("Index:", currentRoleIndex);
            if ((currentRoleIndex + 1) < playerRoles.length) {
                displayPlayerRole(playerRoles[currentRoleIndex]);
                currentRoleIndex++;
                sessionStorage.setItem("currentRoleIndex", currentRoleIndex); // Store updated currentRoleIndex in session storage
                window.location.href = "/roles-wait-screen";
            } else {
                sessionStorage.removeItem("currentRoleIndex");
                window.location.href = "/";
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

    // resetButton.addEventListener("click", function() {
    //     if (currentRoleIndex < playerRoles.length) {
    //         window.location.href = "/distribute-roles";
    //     }
    // });

    // console.log(playerRoles.length);
    // console.log(currentRoleIndex);
    // if (currentRoleIndex > playerRoles.length) {
    //     currentRoleIndex = 0;
    //     sessionStorage.setItem("currentRoleIndex", currentRoleIndex);
    // }


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
            // currentRoleIndex++;
            // sessionStorage.setItem("currentRoleIndex", currentRoleIndex);
        })
        .catch(error => {
            console.error("Error:", error);
        });


});