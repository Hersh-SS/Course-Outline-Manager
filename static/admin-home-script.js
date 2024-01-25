const loggedInName = document.getElementById('logged-in-username');
loggedInName.textContent = `User: ${localStorage.getItem('logged-in-user')}`;

const logOutBtn = document.getElementById('log-out-button');
logOutBtn.addEventListener('click', logOutUser)

function logOutUser() {
    window.location.href = "/index.html";
}

const assignButton = document.getElementById("assign-button");

if (assignButton) {
    assignButton.addEventListener('click', assignProf);
}

function assignProf() {
    window.location.href = "/assign-prof.html";
}


const dataButton = document.getElementById("all-course-button");

if (dataButton) {
    dataButton.addEventListener('click', viewData);
}

function viewData() {
    window.location.href = "/allOutlinesData.html"; 
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