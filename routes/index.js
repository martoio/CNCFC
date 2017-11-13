let express 	= require('express');
const path 		= require('path');
const fs 		= require('fs');
let formidable 	= require('formidable');
const {validateBody, schemas} = require('../util/index');
let router 		= require('express-promise-router')();
let Auth = require('../auth/index');


/* GET home page. */
router.get('/', Auth.isAuthenticated, function(req, res) {
	console.log(req.session);
    res.render('home/index', { title: 'Express', showTeacherOptions: (req.session.user.isTeacher === true) });
});

/**
 * AUTH BELOW
 */
/* GET Auth Page */

router.get('/login', function(req, res){
	res.render('auth/login', {title: "Not Logged in!"});
});

//Login controller implementation in auth/index.js
router.post('/login', validateBody(schemas.authSchema), Auth.login);

//TODO: CHANGE THIS TO POST ONLY!!!!
router.all('/print-file', function(req, res){

	let form = new formidable.IncomingForm();
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
	let start = new Date().getTime();
	for (let i = 0; i < 1e7; i++) {
	  if ((new Date().getTime() - start) > milliseconds){
		break;
	  }
	}
  }

module.exports = router;


