const User = require('../models/User');

module.exports = {

    login: async (req, res, next) => {
        const {username, password} = req.value.body;
        console.log(username, password);
        //check if user exists
        const user = await User.findOne({ username });
        //if user doesn't exist, exit with 401
        if(!user){
            req.session.sessionFlash = {
                type: 'alert alert-danger',
                message: 'Authentication failed. Make sure you provide a valid username/password combination and that you are authorized to use this machine'
            };
            return res.redirect('/login');
        }
        //check if password is valid;
        const isValidPassword = await user.isValidPassword(password);
        //if not a valid password, redirect with error
        if(!isValidPassword){
            req.session.sessionFlash = {
                type: 'alert alert-danger',
                message: 'Authentication failed. Make sure you provide a valid username/password combination and that you are authorized to use this machine'
            };
            return res.redirect('/login');
        }
        req.session.isAuthenticated = true;
        req.session.user = user;
        req.session.sessionFlash = {
            type: 'alert alert-success',
            message: 'Auth success. Welcome! You are signed in as a: '+ ((user.isTeacher) ? 'teacher' : 'student' )
        };
        return res.redirect('/');
    },
    isAuthenticated: (req, res, next) => {
        if(!req.session.isAuthenticated){
            return res.redirect('/login');
        }
        next();
    },

    isAdmin: (req, res, next) => {
        if(!req.session.user.isTeacher){
            return res.redirect('/');
        }
        next();
    },

    getAdminSettings: async (req, res, next) => {

        let users = await User.find({}).select('username');

        console.log(users);

        res.render('settings/admin', {
            title: 'Admin',
            users: users,
            backEnabled: true
        });
    },
    addNewUser: async (req, res, next) => {
        const {username, password} = req.value.body;

        //try to find user
        let duplicateUser = await User.findOne({username});
        //if user exists => redirect back with error;
        if (duplicateUser){
            //set flash message
            req.session.sessionFlash = {
                type: 'alert alert-danger',
                message: 'Username already in use, pick another one'
            };
            return res.redirect('/admin-settings')
        }
        let newUser = new User({username, password});
        let result = await newUser.save();

        if(result){
            //set flash message
            req.session.sessionFlash = {
                type: 'alert alert-success',
                message: `User <b>${username}</b> is now certified!`
            };

            return res.redirect('/admin-settings');
        }

        res.status(404);
        //if user doesn't exist => create + save new user;
        //redirect back with flash message;
    },

};