const path 		= require('path');
const fs 		= require('fs');
let formidable 	= require('formidable');
const {validateBody, schemas} = require('../util/index');
let router 		= require('express-promise-router')();
const AuthController =  require('../controllers/auth');
const PrintController = require('../controllers/print');
const Print = require('../models/Print');
const User = require('../models/User');


/* GET home page. */
router.get('/', AuthController.isAuthenticated, function(req, res) {
    res.render('home/index', { title: 'Express', showTeacherOptions: (req.session.user.isTeacher === true) });
});

/**
 * AUTH BELOW
 */
/* GET Auth Page */

router.get('/login', function(req, res){
	res.render('auth/login', {title: "Not Logged in!"});
});

//Login controller implementation in controllers/auth.js
router.post('/login', validateBody(schemas.authSchema), AuthController.login);

router.route('/print-file')
    .all(AuthController.isAuthenticated)
    .post(PrintController.uploadFile);

router.post('/print', AuthController.isAuthenticated, function (req, res, next) {

});

router.route('/admin-settings')
    .all(AuthController.isAuthenticated, AuthController.isAdmin)
    .get(AuthController.getAdminSettings)
    .post(validateBody(schemas.authSchema), AuthController.addNewUser);


module.exports = router;


