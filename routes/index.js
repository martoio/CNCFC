
const {validateBody, schemas} = require('../util/index');
let router 		= require('express-promise-router')();
const AuthController =  require('../controllers/auth');
const PrintController = require('../controllers/print');
const lib = require('../models/Library');


/**
 * Login Page
 */
router.route('/login')
    .get(function(req, res){
	    res.render('auth/login', {title: "Not Logged in!"});
    })
    .post(validateBody(schemas.authSchema), AuthController.login);

/**
 * Protected routes:
 * authentication required
 */
router.use(AuthController.isAuthenticated);

/* GET home page. */
router.get('/', function(req, res) {
    res.render('home/index', {
        title: 'Home',
        showTeacherOptions: (req.session.user.isTeacher === true),
        backEnabled: false}
    );
});

/**
 * STD-LIB mockery
 */
router.get('/lib', function (req, res) {
    let libChunks = [];
    let chunkSize = 4;
    for(let i =0; i < lib.length; i += chunkSize){
        libChunks.push(lib.slice(i, i+chunkSize));
    }

    res.render('print/lib', {
        title: 'Library',
        backEnabled: true,
        back: '/',
        lib: libChunks
    });
});

/**
 * Print related
 */
router.route('/print-file')
    .post(PrintController.uploadFile);

router.get('/print', PrintController.printFile);
router.get('/print/:libId', PrintController.libUpload);

/**
 * Admin related
 */

router.route('/admin-settings')
    .all(AuthController.isAdmin)
    .get(AuthController.getAdminSettings)
    .post(validateBody(schemas.authSchema), AuthController.addNewUser);

/**
 * Logout
 */
router.get('/logout', AuthController.logout);

module.exports = router;


