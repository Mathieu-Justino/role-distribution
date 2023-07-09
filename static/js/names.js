// This function generates the number of input boxes for player names based on the number of players selected

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

