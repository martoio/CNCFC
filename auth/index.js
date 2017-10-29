
/*
var passport = require('passport')
, LocalStrategy = require('passport-local').Strategy;

passport.use('cnc.logon.local', new LocalStrategy(
function(username, password, done) {
*/
let users = {
    
        teacher: {
            username: 'teacher',
            password: 'test',
            isTeacher: true,
            isAuthorized: true
        },
        student: {
            username: 'student',
            password: 'test',
            isTeacher: false,
            isAuthorized: true
        },
        student2: {
            username: 'student2',
            password: 'test',
            isTeacher: false,
            isAuthorized: false
        }
    
    };

function logon(username, password){
    //Sanity checks
    //undefined
    if(typeof username === 'undefined' || typeof password === 'undefined'){
        return false;
    }
    //in keys
    if(!Object.keys(users).includes(username)){
        return false;
    }

    console.log(username);
    /*
    TODO: implement a better strategy for this. Hard coded at the moment
    cuz lack of time.
    */
    
    //TEST if teacher:
    if(isTeacher(username, password)){
        console.log("TEACHER");
        return users[username];
    } else if (isStudent(username, password)){
        let student = users[username];
        console.log("STUDENT");
        if (!student.isAuthorized) {
            console.log("NOT AUTH");
            return false;
        } else {
            console.log("AUTH");
            return users[username];
        }
        
    } else {
        return false;
    }

}

module.exports = logon;
   
 // });


function isTeacher(uname, password){
    return (users[uname].password === password && users[uname].isTeacher);
}

function isStudent(uname, password){
    return (users[uname].password === password && users[uname].isTeacher === false);
}