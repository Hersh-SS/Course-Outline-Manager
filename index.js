import express from "express";
const app = express();
const port = 4000;

app.use('/', express.static('static'));
app.use(express.json());

import bcrypt from 'bcrypt';

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, child } from 'firebase/database';


const firebaseApp = initializeApp({
    apiKey: "AIzaSyCJTbRVA6coCgZpDv3Mo3TveOgSn93aGLA",
    authDomain: "se3350-project-55ac9.firebaseapp.com",
    projectId: "se3350-project-55ac9",
    storageBucket: "se3350-project-55ac9.appspot.com",
    messagingSenderId: "700103576535",
    appId: "1:700103576535:web:5b6f6ae9714103965a1992",
    measurementId: "G-G386C3Q4XX"
});

// var courseNo = 0; 

// function addItemsToList(course, instructor) {
//     var ul = document.getElementById('list'); 
//     var header = document.createElement("h2"); 

//     var courseC = document.createElement('li'); 
//     var instructorCourse= document.createElement("li"); 

//     header.innerHTML= "Course" + (++courseNo); 

//     courseC.innerHTML= "Course Code: " +course; 
//     instructorCourse.innerHTML = "Instructor: " + instructor; 

//     ul.appendChild(header); 
//     ul.appendChild(courseC); 
//     ul.appendChild(instructorCourse); 
// }

// function FetchAllData() {
//     firebaseApp.database().ref("course").once('value', function(snapshot){
//         snapshot.forEach(
//             function(ChildSnapshot) {
//                 let courseNumber = ChildSnapshot.va1().courseCode; 
//                 let instructorName = ChildSnapshot.va1().instructor; 
//                 addItemsToList(courseNumber, instructorName); 
//             }
//         )
//     })
// }

// if (typeof window !== "undefined") {
//     console.log("works"); 

//     window.onload(FetchAllData()); 
// }


const db = getDatabase(firebaseApp);
const dbRef = ref(getDatabase());

// create new username and password in database
app.post('/users/register', async (req, res) => {
    const username = req.body.username.toLowerCase();
    const password = req.body.password;
    const userrole = req.body.userrole;
    

    if (username == '' || username == null || password == '' || password == null || userrole == null) {
        res.statusMessage = 'Please fill out all fields';
        res.status(400).send();
    }
    else {
        // get 'users/' node then loop through each key
        get(child(dbRef, 'users/')).then((snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach(user => {
                    if (username == user.key) {
                        res.statusMessage = 'Username already exists';
                        res.status(400).send();
                    }
                })
            }
        })

        // password hashing using bcrypt
        try {
            const hashedPasssword = await bcrypt.hash(password, 10);
            const user = {
                username: username,
                password: hashedPasssword,
                userrole: userrole,
            }

            // 'username' is the key in users/ node
            // 'user' is the login details object inside that key
            const setRef = ref(db, 'users/' + username);
            set(setRef, user);

            res.send(user);

        } catch {
            res.statusMessage = 'Server error in /user/login/verify';
            res.status(500).send();
        }
    }
})


// get all courses from firebase
app.get('/course/loadData', (req, res) => {
    const courseArray = [];

    get(child(dbRef, 'course/allVariables/1/')).then((snapshot) => {
        if (snapshot.exists()) {
            snapshot.forEach(course => {
                // push the course object which has all key value pairs
                courseArray.push(course.val());
            })
            res.send(courseArray);
        }
    })
})

// add comment to latest version of chosen course
app.post('/course/specificCourse', (req, res) => {
    const courseCode = req.body.courseCode;
    const comment = req.body.comment;
    let courseArray = [];
    
    get(child(dbRef, `course/${courseCode}`)).then((snapshot) => {
        if (snapshot.exists()) {
            snapshot.forEach(version => {
                courseArray.push(version.val());
            })

            const keys = Object.keys(courseArray[courseArray.length-1]);
            const commentsObj = {};

            keys.forEach((key, index) => {
                commentsObj[key] = courseArray[courseArray.length-1][key];
            })

            commentsObj['comment'] = comment;
            
            const setRef = ref(db, `course/${courseCode}/` + String(courseArray.length));
            set(setRef, commentsObj);

            res.statusMessage = courseCode;
            res.status(200).send();
        }
    })
})

app.get('/course/outlines', (req, res) => {
    const outlinesArr = [];

    get(child(dbRef, 'course/')).then((snapshot) => {
        if (snapshot.exists()) {
            snapshot.forEach(course => {
                const arrObject = {
                    courseCode: course.key,
                    instructor: course.child('instructor').val()
                }
                outlinesArr.push(arrObject);
            })
            res.send(outlinesArr);
        }
    })
})


app.post('/professors/course', async (req, res) => {
    const professor = req.body.professor;
    const course = req.body.course;
    
    

        // get 'users/' node then loop through each key
        /*get(child(dbRef, 'users/')).then((snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach(user => {
                    if (username == user.key) {
                        res.statusMessage = 'Username already exists';
                        res.status(400).send();
                    }
                })
            }
        }) */

        // password hashing using bcrypt
        try {
            const profs = {
                professor: professor,
            }

            // 'username' is the key in users/ node
            // 'user' is the login details object inside that key
            const setRef = ref(db, 'professor/' + course);
            set(setRef, profs);

            res.send(profs);

        } catch {
            res.statusMessage = 'Server error in /professor';
            res.status(500).send();
        }
    }
)

app.post('/course/courseOutline', (req, res) => {
    const user = req.body.user;
    const date = req.body.date; 
    const instructor = req.body.instructor;

    const description = req.body.description; 

    const courseCode = req.body.courseCode;
    const credits = req.body.credits; 
    const antirequisite = req.body.antirequisite; 
    const prerequisite = req.body.prerequisite; 
    const corequisite = req.body.corequisite; 
    const engineeringScience = req.body.engineeringScience; 
    const engineeringDesign = req.body.engineeringDesign; 
    const requiredTextbook = req.body.requiredTextbook; 
    const otherRequiredReferences = req.body.otherRequiredReferences; 
    const RecommendedReferences = req.body.RecommendedReferences; 



    const knowledgeBase = req.body.knowledgeBase; 
    const engineeringTool = req.body.engineeringTool; 
    const impactSocietyEnvironment = req.body.impactSocietyEnvironment; 
    const problemAnalysis = req.body.problemAnalysis; 
    const individualTeamWork = req.body.individualTeamWork; 
    const ethicsEquity = req.body.ethicsEquity;
    const investigate = req.body.investigate; 
    const communicationSkills = req.body.communicationSkills; 
    const economicsAndProjectManagement = req.body.economicsAndProjectManagement; 
    const design = req.body.design; 
    const professionalism = req.body.professionalism; 
    const lifeLongLearning = req.body.lifeLongLearning; 



    const knowledgeBasetxt = req.body.knowledgeBasetxt; 
    const engineeringTooltxt = req.body.engineeringTooltxt; 
    const impactSocietyEnvironmenttxt = req.body.impactSocietyEnvironmenttxt; 
    const problemAnalysistxt = req.body.problemAnalysistxt; 
    const individualTeamWorktxt = req.body.individualTeamWorktxt; 
    const ethicsEquitytxt = req.body.ethicsEquitytxt;
    const investigatetxt = req.body.investigatetxt; 
    const communicationSkillstxt = req.body.communicationSkills; 
    const economicsAndProjectManagementtxt = req.body.economicsAndProjectManagementtxt; 
    const designtxt = req.body.designtxt; 
    const professionalismtxt = req.body.professionalismtxt; 
    const lifeLongLearningtxt = req.body.lifeLongLearningtxt;

    const homeworkAssigmentsEvaluation = req.body.homeworkAssigmentsEvaluation; 
    const quizzes = req.body.quizzes; 
    const laboratory = req.body.laboratory; 
    const midtermTest = req.body.midtermTest; 
    const finalExamination = req.body.finalExamination; 
    const topicOneR1 = req.body.topicOneR1; 
    const topicOneR2 = req.body.topicOneR2; 
    const topicTwoR1 = req.body.topicTwoR1; 
    const topicTwoR2 = req.body.topicTwoR2; 
    const topicThreeR1 = req.body.topicThreeR1; 
    const topicThreeR2 = req.body.topicThreeR2; 
    const topicFourR1 = req.body.topicFourR1; 
    const topicFourR2 = req.body.topicFourR2; 
    const ceab1= req.body.ceab1; 
    const ceab2= req.body.ceab2;   
    const ceab3= req.body.ceab3;
    const ceab4= req.body.ceab4;
    const homeworkAssigments = req.body.homeworkAssigments; 
    const quizzes2 = req.body.quizzes2; 
    const laboratory2 = req.body.laboratory2; 
    const midtermTest2 = req.body.midtermTest2; 
    const lateSubmissionPolicy = req.body.lateSubmissionPolicy; 
    const assigmentSubmissionLocker = req.body.assigmentSubmissionLocker; 
    const useOfEnglish= req.body.useOfEnglish;
    const useOfElectronicDevices = req.body.useOfElectronicDevices; 
    const useofPersonalDevices = req.body.useofPersonalDevices; 
    const attendance= req.body.attendance;
    const absence=req.body.absence;
    const missedMidterm= req.body.missedMidterm;
    const cheatingAndPlagiarism= req.body.cheatingAndPlagiarism;
    const policy= req.body.policy;
    const internetAndElectronicMail= req.body.internetAndElectronicMail;
    const Accessibility= req.body.Accessibility;
    const supportServices= req.body.supportServices;

// const saveButton= req.body.saveButton;
    // const date_time_button = req.body.date_time_button; 
    // const logged-in-username = req.body.logged-in-username; 

    try {

        

    const nodeRef = ref(db, "course/");
    let version = 1; 

    get(child(nodeRef, courseCode)).then((snapshot) => {
    if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
        const latestVersion = parseInt(childSnapshot.key);
        version = latestVersion + 1;
        });
    }

    const course = { 
        user: user,
        myDate: date,
        comment: 'none',

        description: description,
        courseCode: courseCode,

        // working now 
        instructor: instructor, 

        credits: credits, 
        antirequisite: antirequisite, 
        prerequisite: prerequisite, 
        corequisite: corequisite,
        engineeringScience: engineeringScience, 
        engineeringDesign: engineeringDesign, 
        requiredTextbook: requiredTextbook, 
        otherRequiredReferences: otherRequiredReferences, 
        RecommendedReferences: RecommendedReferences,

        knowledgeBase: knowledgeBase,
        engineeringTool: engineeringTool, 
        impactSocietyEnvironment: impactSocietyEnvironment, 
        problemAnalysis: problemAnalysis, 
        individualTeamWork: individualTeamWork, 
        ethicsEquity: ethicsEquity, 
        investigate: investigate, 
        communicationSkills: communicationSkills, 
        economicsAndProjectManagement: economicsAndProjectManagement, 
        design: design, 
        professionalism: professionalism, 
        lifeLongLearning: lifeLongLearning,



        knowledgeBasetxt: knowledgeBasetxt,
        engineeringTooltxt: engineeringTooltxt, 
        impactSocietyEnvironmenttxt: impactSocietyEnvironmenttxt, 
        problemAnalysistxt: problemAnalysistxt, 
        individualTeamWorktxt: individualTeamWorktxt, 
        ethicsEquitytxt: ethicsEquitytxt, 
        investigatetxt: investigatetxt, 
        communicationSkillstxt: communicationSkillstxt, 
        economicsAndProjectManagementtxt: economicsAndProjectManagementtxt, 
        designtxt: designtxt, 
        professionalismtxt: professionalismtxt, 
        lifeLongLearningtxt: lifeLongLearningtxt,

        homeworkAssigmentsEvaluation: homeworkAssigmentsEvaluation, 
        quizzes: quizzes, 
        laboratory: laboratory, 
        midtermTest: midtermTest, 
        finalExamination: finalExamination,
        topicOneR1: topicOneR1, 
        topicOneR2: topicOneR2, 
        topicTwoR1: topicTwoR1, 
        topicTwoR2: topicTwoR2, 
        topicThreeR1: topicThreeR1, 
        topicThreeR2: topicThreeR2, 
        topicFourR1: topicFourR1, 
        topicFourR2: topicFourR2, 
        ceab1:ceab1,
        ceab2:ceab2,
        ceab3:ceab3,
        ceab4:ceab4,

        homeworkAssigments: homeworkAssigments, 
        quizzes2: quizzes2, 
        laboratory2: laboratory2, 
        midtermTest2: midtermTest2, 
        lateSubmissionPolicy: lateSubmissionPolicy, 
        assigmentSubmissionLocker: assigmentSubmissionLocker, 
        useOfEnglish:useOfEnglish,

        useOfElectronicDevices: useOfElectronicDevices, 
        useofPersonalDevices: useofPersonalDevices,
        attendance:attendance,
        absence:absence,
        missedMidterm:missedMidterm,
        cheatingAndPlagiarism:cheatingAndPlagiarism,
        policy:policy,
        internetAndElectronicMail:internetAndElectronicMail,
        Accessibility:Accessibility,
        supportServices:supportServices, 
        version: version
       
    }

    

    const setRef = ref(db, 'course/' + courseCode + '/' + version + '/');
    set(setRef, course);
    res.status = 'Added!';
    res.send(course);
    });
            
        

       
    }catch {

     res.status = 'Error!';

    }

    
    
})

// get username and check password then login 
app.post('/users/login', (req, res) => {
    const username = req.body.username.toLowerCase();
    const password = req.body.password;
    const userrole = req.body.userrole;
    var usernameExists = false;

    if (username == '' || username == null || password == '' || password == null) {
        res.statusMessage = 'Please fill out all fields';
        res.status(400).send();
    }
    else {
        get(child(dbRef, 'users/')).then(async (snapshot) => {
            if (snapshot.exists()) {
                // get data in js form
                const users = snapshot.val();
    
                // get an array of all keys then loop through each
                const usersArray = Object.keys(users).map(key => ({ key, ...users[key] }));
                for (const user of usersArray) {
                    if (username == user.key) {
                        usernameExists = true;
                        // password match
                        if (await bcrypt.compare(password, user.password)) {
                            res.send({
                                value: "success",
                                user: user
                            });
                        }
                        else {
                            res.statusMessage = 'Password incorrect';
                            res.status(400).send();
                        }
                    }
                }
                if (!usernameExists) {
                    res.statusMessage = 'Username does not exist';
                    res.status(400).send();
                }
            }
            else {
                res.statusMessage = 'Username does not exist';
                res.status(400).send();
            }
        });
    }
})




// Mock outline document.
const mockOutline = {
    title: "SE 3350B: Software Engineering Design I",
    gradeAttributes: {
        topics: [ 
`
1. Effective Teamwork
At the end of this section, students will be able to:
a. Identify the main components of effective teams and address them to define their teams.
b. Anticipate and plan for mitigating team conflicts.
c. Write and adhere to a team contract.
d. d. Monitor their team dynamics and address any issues along the way
`,

`
2. Agile Methodology and Scrum Framework.
At the end of this section, students will be able to:
a. Understand and implement the Agile methodology
b. Understand and use the Scrum framework
`
        ],

        indicators: [
            "KB3",
            "PA2"
        ]
    }
}

// TODO: Endpoint to create a outline.


// Endpoint to get all the outlines.
// get username and check password then login 
app.get('/outlines', (req, res) => { 
    res.json({
        outlines: [mockOutline]
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
    console.log("http://localhost:4000");
});