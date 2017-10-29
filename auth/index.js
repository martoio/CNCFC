
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
            isTeacher: true
        },
        student: {
            
        }
    
    };

function logon(username, password){
     /*
    TODO: implement a better strategy for this. Hard coded at the moment
    cuz lack of time.
    */
    
    //TEST if teacher:
    if(isTeacher(username, password)){
        console.log("TEACHER");
        return true;
    } else if (isStudent(username, password)){
        let student = users.username;
        console.log("STUDENT");
        if (!student.isAuthorized) {
            console.log("NOT AUTH");
            return false;
        } else {
            console.log("AUTH");
            return true;    
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