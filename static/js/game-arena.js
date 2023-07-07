document.addEventListener("DOMContentLoaded", function() {

    const players = [];

    fetch("/get-player-roles-factions")
        .then(response => response.json())
        .then(data => {
            players.push(...data); // Add player roles to the array
            console.log(players)

            // Get the table body element by its id
            const tableBody = document.getElementById("player-table-body");
    
            // Loop through the players array
            players.forEach(player => {
            // Create a table row element
                const tableRow = document.createElement("tr");
    
                // Create a table cell element for the player name
                const nameCell = document.createElement("td");
                // Set the text content of the name cell to the player name
                nameCell.textContent = player[0];
    
                // Create a table cell element for the reveal button
                const buttonCellReveal = document.createElement("td");
                // Create a button element
                const buttonFaction = document.createElement("button");
                const buttonRole = document.createElement("button");
                // Set the text content of the button to "Reveal"
                buttonFaction.textContent = "Reveal Party Membership";
                buttonRole.textContent = "Reveal Secret Role";
            

                const modal = document.getElementById("modal");
                const role = document.getElementById("role");
                const close = document.getElementById("close");

                buttonFaction.addEventListener("click", () => {
                    modal.style.display = "block";
                    role.textContent = `${player[0]} is a ${player[1]}`;
                });
                buttonRole.addEventListener("click", () => {
                    modal.style.display = "block";
                    role.textContent = `${player[0]}'s secret role is ${player[2]}`;
                });

                // Add an event listener to the close button that hides the modal when clicked
                close.addEventListener("click", () => {
                    // Hide the modal by changing its display value to none
                    modal.style.display = "none";
                });

    
                // Append the button to the button cell
                buttonCellReveal.append(buttonFaction, " ", buttonRole);
    
                // Append the name cell and the button cell to the table row
                tableRow.appendChild(nameCell);
                tableRow.appendChild(buttonCellReveal);
    
                // Append the table row to the table body
                tableBody.appendChild(tableRow);
            });
        })
        .catch(error => {
            console.error("Error:", error);
        });
});