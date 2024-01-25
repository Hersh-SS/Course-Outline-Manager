const registerBtn = document.getElementById("register-button");
const loginBtn = document.getElementById("login-button");
const saveButton = document.getElementById("saveButton"); 
const loadDataBtn = document.getElementById('load-data');
const confirmBtn = document.getElementById('confirm-button');
const addCommentBtn = document.getElementById('review-course-button');

const savedUser = localStorage.getItem('logged-in-user');
const savedTime = localStorage.getItem("date_time_button"); 

document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      loginUser();
    }
  });

if (addCommentBtn) {
    addCommentBtn.addEventListener('click', addComments);
}

if (registerBtn) {
    registerBtn.addEventListener('click', registerUser);
}

if (loginBtn) {
    loginBtn.addEventListener('click', loginUser);
}

if (saveButton) {
    saveButton.addEventListener('click', saveData);
}

if (loadDataBtn) {
    loadDataBtn.addEventListener('click', loadData);
}

if (confirmBtn) {
    confirmBtn.addEventListener('click', assignProfToCourse)
    doc.save('document.pdf');
}


// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-analytics.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJTbRVA6coCgZpDv3Mo3TveOgSn93aGLA",
    authDomain: "se3350-project-55ac9.firebaseapp.com",
    databaseURL: "https://se3350-project-55ac9-default-rtdb.firebaseio.com",
    projectId: "se3350-project-55ac9",
    storageBucket: "se3350-project-55ac9.appspot.com",
    messagingSenderId: "700103576535",
    appId: "1:700103576535:web:5b6f6ae9714103965a1992",
    measurementId: "G-G386C3Q4XX"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// add comment to latest version of chosen course
function addComments() {
    fetch('/course/specificCourse', {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({
            courseCode: document.getElementById('myDropdown').value,
            comment: document.getElementById('review-course-textarea').value
        })
    })
    .then(res => {
        if (res.ok) {
            alert(`Your comment has been added to course ${res.statusText}`);
        }
        else {
            alert('Something wrong');
        }
    })
}

// Register the user
function registerUser() {
    // register user to database
    fetch('/users/register', {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,
            userrole: document.getElementById('user-role').value,
        })
    })
    .then(res => {
        if (res.ok) {
            alert("Registration successful! Please login with your username and password")
        }

        else if (res.statusText == 'Username already exists') {
            alert("Username already exists, please login or register with a different username");
            return false;
        }

        else {
            alert(res.statusText);
            return false;
        }
    })
}

function loginUser() {
    // log in to user stored in database
    fetch('/users/login', {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,
            userrole: document.getElementById('user-role').value,
        })
    })
    .then(async (res) => {
        if (res.ok) {
            try {
                // Get the user from the reponse, and save it to local storage.
                const data = await res.json();

                // alert('Logged in');
                localStorage.setItem('logged-in-user', document.getElementById('username').value);
                //window.location.href = "/home.html";

                // console.log("CHECK USER ROLE: " + document.getElementById('user-role').value);

                // Check if the role is administrator
                // console.log(document.getElementById('user-role').value);
                if(document.getElementById('user-role').value == "Administrator") {
                    window.location.href = "./admin-home.html";
                }
                else if(document.getElementById('user-role').value == "Department Chair") {
                    window.location.href = "./department-home.html";
                }
                else if(document.getElementById('user-role').value == "Program Director") {
                    window.location.href = "./program-director-home.html";
                }
                else if(document.getElementById('user-role').value == "Associate Chair") {
                    window.location.href = "./associate-chair-home.html";
                }
                else {
                    window.location.href = "./home.html";
                }
            }
            catch(error) {
                console.error(error);
            }
            
        }

        else if (res.statusText == 'Username does not exist') {
            alert('Username does not exist, please register to create one or login using the correct username')
        }

        else {
            alert(res.statusText);
            return false;
        }
    })
}

function loadData() {
    fetch('/course/loadData')
    .then(res => res.json())
    .then(data => {
        const courseArray = [];

        data.forEach(course => {
            // filter courses that the current user saved
            if (course.user == savedUser) {
                courseArray.push(course);
            }
        })

        if (courseArray.length > 0) {
            courseArray.forEach(course => {
                // loop through keys which are courseCode, description, etc
                for (let key in course) {
                    if (key != 'user') {
                        // set html to value of that key
                        document.getElementById(key).value = course[key];
                    }
                }
            })
        }
        else {
            // show message for no saved data
            const div = document.getElementById('load-data-div');
            const message = document.createElement('p');
            message.textContent = `No saved data for ${savedUser}`;

            // show message one time
            if (div.childElementCount > 0) {
                let first = div.firstElementChild;
                while (first) {
                    first.remove();
                    first = div.lastElementChild;
                }
            }

            div.appendChild(message);

        }

    })
}

function saveData() {
    fetch('/course/courseOutline', {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({
            courseCode: document.getElementById('courseCode').value,
            instructor: document.getElementById('instructor').value,

            date: localStorage.getItem("date_time_button"), 
            user: savedUser,

            description: document.getElementById('description').value,
            credits: document.getElementById('credits').value, 
            antirequisite: document.getElementById("antirequisite").value, 
            prerequisite: document.getElementById("prerequisite").value, 
            corequisite: document.getElementById("corequisite").value,
            engineeringScience: document.getElementById("engineeringScience").value, 
            engineeringDesign: document.getElementById("engineeringDesign").value, 

            requiredTextbook: document.getElementById("requiredTextbook").value, 
            otherRequiredReferences: document.getElementById('otherRequiredReferences').value, 
            RecommendedReferences: document.getElementById("RecommendedReferences").value,


            knowledgeBase: document.getElementById('knowledgeBase').value,
            engineeringTool: document.getElementById("engineeringTool").value,
            impactSocietyEnvironment: document.getElementById("impactSocietyEnvironment").value, 
            problemAnalysis: document.getElementById("problemAnalysis").value, 
            individualTeamWork: document.getElementById("individualTeamWork").value, 
            ethicsEquity: document.getElementById("ethicsEquity").value, 
            investigate: document.getElementById("investigate").value, 
            communicationSkills: document.getElementById("communicationSkills").value,
            economicsAndProjectManagement: document.getElementById("economicsAndProjectManagement"),
            design: document.getElementById("design").value,
            professionalism: document.getElementById("professionalism").value, 
            lifeLongLearning: document.getElementById("lifeLongLearning").value ,




            knowledgeBasetxt: document.getElementById('knowledgeBasetxt').value,
            engineeringTooltxt: document.getElementById("engineeringTooltxt").value,
            impactSocietyEnvironmenttxt: document.getElementById("impactSocietyEnvironmenttxt").value, 
            problemAnalysistxt: document.getElementById("problemAnalysistxt").value, 
            individualTeamWorktxt: document.getElementById("individualTeamWorktxt").value, 
            ethicsEquitytxt: document.getElementById("ethicsEquitytxt").value, 
            investigatetxt: document.getElementById("investigatetxt").value, 
            communicationSkillstxt: document.getElementById("communicationSkillstxt").value,
            economicsAndProjectManagementtxt: document.getElementById("economicsAndProjectManagementtxt").value,
            designtxt: document.getElementById("designtxt").value,
            professionalismtxt: document.getElementById("professionalismtxt").value, 
            lifeLongLearningtxt: document.getElementById("lifeLongLearningtxt").value ,



            homeworkAssigmentsEvaluation: document.getElementById("homeworkAssigmentsEvaluation").value, 
            quizzes: document.getElementById("quizzes").value, 
            laboratory: document.getElementById("laboratory").value, 
            midtermTest: document.getElementById("midtermTest").value, 
            finalExamination: document.getElementById("finalExamination").value,



            topicOneR1: document.getElementById("topicOneR1").value,
            topicOneR2: document.getElementById("topicOneR2").value, 
            topicTwoR1: document.getElementById("topicTwoR1").value, 
            topicTwoR2: document.getElementById("topicTwoR2").value, 
            topicThreeR1: document.getElementById("topicThreeR1").value, 
            topicThreeR2: document.getElementById("topicThreeR2").value, 
            topicFourR1: document.getElementById("topicFourR1").value, 
            topicFourR2: document.getElementById("topicFourR2").value, 



            ceab1:document.getElementById("ceab1").value, 
            ceab2:document.getElementById("ceab2").value, 
            ceab3:document.getElementById("ceab3").value, 
            ceab4:document.getElementById("ceab4").value,







            homeworkAssigments: document.getElementById("homeworkAssigments").value, 
            quizzes2: document.getElementById("quizzes2").value, 
            laboratory2: document.getElementById("laboratory2").value, 
            midtermTest2: document.getElementById("midtermTest2").value, 
            lateSubmissionPolicy: document.getElementById("lateSubmissionPolicy").value, 
            assigmentSubmissionLocker: document.getElementById("assigmentSubmissionLocker").value, 
            useOfEnglish:document.getElementById("useOfEnglish").value,
            useOfElectronicDevices: document.getElementById("useOfElectronicDevices").value,
            useofPersonalDevices: document.getElementById("useofPersonalDevices").value,

            
            attendance:document.getElementById("attendance").value,
            absence:document.getElementById("absence").value,
            missedMidterm:document.getElementById("missedMidterm").value,
            cheatingAndPlagiarism:document.getElementById("cheatingAndPlagiarism").value,
            policy:document.getElementById("policy").value,
            internetAndElectronicMail:document.getElementById("internetAndElectronicMail").value,
            Accessibility:document.getElementById("Accessibility").value,
            supportServices:document.getElementById("supportServices").value,
            // date_time_button:document.getElementById("date_time_button").value
            // saveButton:document.getElementById("saveButton").value


        })
    })
    .then (res => {
        if (res.statusMessage == "Error!") {
            alert("Error!")
        } else {
            localStorage.setItem('date_time_button', Date());
            alert("Added!")
        }
    })

    if(true) {
        //onclick="document.getElementById('date_time_button').innerHTML = Date();
        // timeStamp = Date();
        // console.log("Date: " + timeStamp);
    }
}

// Assign a specific Professor to a specific Course
function assignProfToCourse() {
    fetch('/professors/course', {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({
            course: document.getElementById('choose-courses').value,
            professor: document.getElementById('assign-prof').value
        })
    })
    .then (res => {
        if (res.ok) {
            alert("Professor has been assigned to course")
        }
        else {
            alert("Error assigning professor to course")
        }
    })
}

// Populate the drop down menu to get the values of the existing courses
// function populateDropdown() {
    const dropdown = document.getElementById("myDropdown");
  
    const database = getDatabase(firebaseApp);
    const courseRef = ref(database, "course");
    onValue(courseRef, (snapshot) => {
      const data = snapshot.val();
      const courses = Object.entries(data).map(([key, value]) => ({
        id: key,
        courseCode: key,
        //instructor: value.instructor,
      }));
  
      dropdown.innerHTML = ""; // clear existing options
  
      courses.forEach((course) => {
        const option = document.createElement("option");
        option.value = course.id;
        // option.text = `${course.courseCode} (${course.instructor})`;
        option.text = `${course.courseCode}`;
        dropdown.appendChild(option);
      });
    });
//   }


// Send timeStamp to the backend


// // Course Outline from the backend
// const courseOutlineInput = await fetch('/courseOutline', {
//     // register user to database
//         method: 'POST',
//         headers: {'Content-type': 'application/json'},
//         body: JSON.stringify({
//             description: document.getElementById('description').value,
//         })
//     .then(res => {

//     })
// })

// Read the data being sent from the user


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
    fetch('/course/outlines')
    .then(res => res.json())
    .then(data => {
        localStorage.setItem('allCoursesArray', JSON.stringify(data));
    })
    window.location.href = "/allOutlinesData.html";
}

async function fetchOutlines() {
    try {
        const res = await fetch('/outlines', {
            method: 'GET',
            headers: {'Content-type': 'application/json'},
        });
        const user = await res.json();
        localStorage.setItem("user", JSON.stringify(user));
    }
    catch(error) {
        console.error(error);
    }
    
}

fetchOutlines();

