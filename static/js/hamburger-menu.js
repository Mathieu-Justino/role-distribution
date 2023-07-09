// This function adds a class name to the navigation menu to permit a hamburger menu to be enabled when screen width is small enough
function hambMenu() {
    var x = document.getElementById("top-nav");
    if (x.className === "top-nav") {
        x.className += " responsive";
    } else {
        x.className = "top-nav";
    }
}

// This function permits the animation of the hamburger menu icon
function iconAnimation(x) {
    x.classList.toggle("change");
}