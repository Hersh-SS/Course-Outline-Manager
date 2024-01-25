const createButton = document.getElementById("view-button");

if (createButton) {
    createButton.addEventListener('click', createOutline);
}

function createOutline() {
    window.location.href = "/view-grad-atr.html";
}