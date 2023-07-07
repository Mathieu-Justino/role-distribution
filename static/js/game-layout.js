const quitButton = document.getElementById("quit-button");
const restartButton = document.getElementById("restart-button");

quitButton.addEventListener("click", function() {
    sessionStorage.removeItem("currentRoleIndex");
});

restartButton.addEventListener("click", function() {
    sessionStorage.removeItem("currentRoleIndex");
});