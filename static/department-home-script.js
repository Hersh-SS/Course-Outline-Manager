const loggedInName = document.getElementById('logged-in-username');
loggedInName.textContent = `User: ${localStorage.getItem('logged-in-user')}`;

const logOutBtn = document.getElementById('log-out-button');
logOutBtn.addEventListener('click', logOutUser)

const viewCourseButton = document.getElementById('view-course-button');

function logOutUser() {
    window.location.href = "/index.html";
}

// Link to the review approval page
const reviewApprovalButton = document.getElementById("review-approval-button");

if (reviewApprovalButton) {
    reviewApprovalButton.addEventListener('click', assignApproval);
}

function assignApproval() {
    window.location.href = "/review-course.html";     // Link to the review process page in Sprint 4
}

if (viewCourseButton) {
    viewCourseButton.addEventListener('click', viewCourses);
}

function viewCourses() {
    window.location.href = "/view-prof-my-courses.html";
}



// Link to the review history of changes of all course outlines page
const historyButton = document.getElementById("review-history-button");

if (historyButton) {
    historyButton.addEventListener('click', historyApproval);
}

function historyApproval() {
    window.location.href = "/allOutlinesData.html";
}
