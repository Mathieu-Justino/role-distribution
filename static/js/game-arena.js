document.addEventListener("DOMContentLoaded", function() {

    const players = [];

    fetch("/get-player-roles-factions")
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