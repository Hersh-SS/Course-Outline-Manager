const createCourseButton = document.getElementById("confirm-button");

if (createCourseButton) {
    createCourseButton.addEventListener('click', confirmAlert);
}

function confirmAlert() {
    // Alert message to confirm professor to course selection
    alert("Assign Professor to Course was successful!");
}