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


const User = require('../models/User');

module.exports = {

    login: async (req, res, next) => {
        const {username, password} = req.value.body;
        //check if user exists
        const user = await User.findOne({ username });
        //if user doesn't exist, exit with 401
        if(!user){
            req.session.sessionFlash = {
                type: 'alert alert-danger',
                message: 'Authentication failed. Make sure you provide a valid username/password combination and that you are authorized to use this machine'
            };
            res.redirect('/login');
        }
        //check if password is valid;
        const isValidPassword = await user.isValidPassword(password);
        //if not a valid password, redirect with error
        if(!isValidPassword){
            req.session.sessionFlash = {
                type: 'alert alert-danger',
                message: 'Authentication failed. Make sure you provide a valid username/password combination and that you are authorized to use this machine'
            };
            res.redirect('/login');
        }
        req.session.isAuthenticated = true;
        req.session.user = user;
        req.session.sessionFlash = {
            type: 'alert alert-success',
            message: 'Auth success. Welcome! You are signed in as a: '+ ((user.isTeacher) ? 'teacher' : 'student' )
        };
        res.redirect('/');
    },
    isAuthenticated: (req, res, next) => {
        if(!req.session.isAuthenticated){
            return res.redirect('/login');
        }
        next();
    },

};