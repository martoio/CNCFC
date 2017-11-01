var express = require('express');
var router = express.Router();

var authenticate = require('../auth/index');


/* GET home page. */
router.get('/', function(req, res, next) {
	console.log(req.session);
	if(req.session.isAuthenticated){
		res.render('home/index', { title: 'Express', showTeacherOptions: (req.session.user.isTeacher == true) });
	} else {
		res.redirect('/login');
	}
});


/**
 * AUTH BELOW
 */
/* GET Auth Page */

router.get('/login', function(req, res, next){
	res.render('auth/login', {title: "Not Logged in!"});
});

router.post('/login', function(req, res, next){
	let username = req.body.username;
	let password = req.body.password;
	
	let user = authenticate(username, password);
	console.log(`${user}`);
	if(user){
		req.session.isAuthenticated = true;
		req.session.user = user;
		req.session.sessionFlash = {
			type: 'alert alert-success',
			message: 'Auth success. Welcome! You are signed in as a: '+ ((user.isTeacher) ? 'teacher' : 'student' )
		};
		res.redirect('/');
	} else {
		//TODO: Implement better stuff here:
		req.session.sessionFlash = {
			type: 'alert alert-danger',
			message: 'Authentication failed. Make sure you provide a valid username/password combination and that you are authorized to use this machine'
		};
		res.redirect('/login');
	}
});

module.exports = router;


