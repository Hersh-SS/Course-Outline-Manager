const loggedInName = document.getElementById('logged-in-username');
loggedInName.textContent = `User: ${localStorage.getItem('logged-in-user')}`;

const logOutBtn = document.getElementById('log-out-button');
logOutBtn.addEventListener('click', logOutUser)

function logOutUser() {
    window.location.href = "/index.html";
}

const createButton = document.getElementById("create-button");
const assignButton = document.getElementById("assign-button");
const createCourseButton = document.getElementById('create-course-button');
const viewCourseButton = document.getElementById('view-course-button');

if (createButton) {
    createButton.addEventListener('click', createOutline);
}

function createOutline() {
    window.location.href = "/grad-atr.html";
}

if (createCourseButton) {
    createCourseButton.addEventListener('click', createCourseOutline);
}

function createCourseOutline() {
    window.location.href = './outline.html';
}

if (assignButton) {
    assignButton.addEventListener('click', assignProf);
}

function assignProf() {
    window.location.href = "/assign-prof.html";
}

if (viewCourseButton) {
    viewCourseButton.addEventListener('click', viewCourses);
}

function viewCourses() {
    window.location.href = "/view-prof-my-courses.html";
}

// Link to the all course outlines
const viewAllCourseButton = document.getElementById('view-all-course-button');

if (viewAllCourseButton) {
    viewAllCourseButton.addEventListener('click', viewAllCourses);
}

function viewAllCourses() {
    window.location.href = "/allOutlinesData.html";
}

// Link to the review approval page
const reviewApprovalButton = document.getElementById("review-approval-button");

if (reviewApprovalButton) {
    reviewApprovalButton.addEventListener('click', assignApproval);
}

function assignApproval() {
    window.location.href = "/review-course.html";     // Link to the review process page in Sprint 4
}

async function fetchOutlines() {
    try {
        const res = await fetch('/outlines', {
            method: 'GET',
            headers: {'Content-type': 'application/json'},
        });
        const user = await res.json();
        console.log(user);
        localStorage.setItem("user", JSON.stringify(user));
    }
    catch(error) {
        console.error(error);
    }

}

fetchOutlines();