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
    /*
    TODO: implement a better strategy for this. Hard coded at the moment
    cuz lack of time.
    */
    
    //TEST if teacher:
    if(isTeacher(username, password)){
        return users[username];
    } else if (isStudent(username, password)){
        let student = users[username];
        if (!student.isAuthorized) {
            return false;
        } else {            
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