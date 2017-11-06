var express 	= require('express');
const path 		= require('path');
const fs 		= require('fs');
var formidable 	= require('formidable');


var router 		= express.Router();


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

//TODO: CHANGE THIS TO POST ONLY!!!!
router.all('/print-file', function(req, res, next){

	var form = new formidable.IncomingForm();
	form.uploadDir = path.join(__dirname, '../print-uploads');

	// every time a file has been uploaded successfully,
	// rename it to it's orignal name
	form.on('file', function(field, file) {
		fs.rename(file.path, path.join(form.uploadDir, file.name));
	});

	// log any errors that occur
	form.on('error', function(err) {
		console.log('An error has occured: \n' + err);
	});

	// once all the files have been uploaded, send a response to the client
	form.on('end', function() {

		let svgPath = path.join(__dirname, '../print-uploads/driller.svg');
		let gCode = fs.readFileSync(path.join(__dirname, '../gcode/driller.gcode'), 'utf8');


		console.log(gCode);
		sleep(2000);
		res.render('print/file-upload', {
			svg: svgPath,
			gcode: gCode
		});
	});

	// parse the incoming request containing the form data
	form.parse(req);

	console.log(res.body);

});


function sleep(milliseconds) {
	var start = new Date().getTime();
	for (var i = 0; i < 1e7; i++) {
	  if ((new Date().getTime() - start) > milliseconds){
		break;
	  }
	}
  }

module.exports = router;


