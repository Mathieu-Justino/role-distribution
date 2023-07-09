// This code ensures that when the user restarts or quits the game, the player counter is erased 
// The player counter permits the code to know what player role to display, if it's not erased, the next time the user starts a game, the site might display Player 6 first, and ignore the first 5 players

const quitButton = document.getElementById("quit-button");
const restartButton = document.getElementById("restart-button");

quitButton.addEventListener("click", function() {
    sessionStorage.removeItem("currentRoleIndex");
});

restartButton.addEventListener("click", function() {
    sessionStorage.removeItem("currentRoleIndex");
});