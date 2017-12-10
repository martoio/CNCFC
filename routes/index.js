
const {validateBody, schemas} = require('../util/index');
let router 		= require('express-promise-router')();
const AuthController =  require('../controllers/auth');
const PrintController = require('../controllers/print');
const CNC = require('../models/CNC');
const path = require('path');

/* GET home page. */
router.get('/', AuthController.isAuthenticated, function(req, res) {
    res.render('home/index', { title: 'Express', showTeacherOptions: (req.session.user.isTeacher === true), backEnabled: false});
});

/**
 * STD-LIB mockery
 */
router.get('/lib', function (req, res) {
    res.render('print/lib', {
        backEnabled: true,
        back: '/'
    });
});

router.get('/lib/print/:id', function (req, res) {
    const map = {
        "001": "001-seal.svg",
        "002": "002-airplane.svg",
        "003": "003-car.svg",
        "004": "004-boat.svg",
        "005": "005-owl.svg",
        "006": "006-dog.svg",
        "007": "007-tulip.svg",
        "008": "008-fish.svg",
        "009": "009-turtle.svg",
        "010": "010-chicken.svg",
        "011": "011-ice-cream.svg",
        "012": "012-piece-of-cake.svg",
        "013": "013-pizza-slice.svg",
        "014": "014-internet.svg",
        "015": "015-abacus.svg",
        "016": "016-blackboard.svg",
        "017": "017-bottle.svg",
        "018": "018-science-2.svg",
        "019": "019-technology.svg",
        "020": "020-medical.svg",
        "021": "021-science-1.svg",
        "022": "022-science.svg",
        "023": "023-avatar.svg",
        "024": "024-cold.svg",
        "025": "025-nature-1.svg",
        "026": "026-nature.svg",
        "027": "027-present.svg",
    };
    let fileSelected = map[req.params.id];
    res.render('print/print-lib', {
        previewPath: "/"+fileSelected,
        libId: req.params.id
    });
});

router.get('/lib/print/gcode/:id', function (req, res) {
    const map = {
        "001": "001-seal.ngc",
        "002": "002-airplane.ngc",
        "003": "003-car.ngc",
        "004": "004-boat.ngc",
        "005": "005-owl.ngc",
        "006": "006-dog.ngc",
        "007": "007-tulip.ngc",
        "008": "008-fish.ngc",
        "009": "009-turtle.ngc",
        "010": "010-chicken.ngc",
        "011": "011-ice-cream.ngc",
        "012": "012-piece-of-cake.ngc",
        "013": "013-pizza-slice.ngc",
        "014": "014-internet.ngc",
        "015": "015-abacus.ngc",
        "016": "016-blackboard.ngc",
        "017": "017-bottle.ngc",
        "018": "018-science-2.ngc",
        "019": "019-technology.ngc",
        "020": "020-medical.ngc",
        "021": "021-science-1.ngc",
        "022": "022-science.ngc",
        "023": "023-avatar.ngc",
        "024": "024-cold.ngc",
        "025": "025-nature-1.ngc",
        "026": "026-nature.ngc",
        "027": "027-present.ngc",
    };

    const gCodeFile = path.join(__dirname, '../std-lib/gcode', map[req.params.id]);

    const print = {

        id: Math.floor(Math.random()*100),
        gCodePath: gCodeFile,
        status: 'NOT_STARTED'
    };
    console.log(gCodeFile);
    CNC.printFile(print);
    res.render('print/print-gcode', {backEnabled: true});
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

router.get('/print', AuthController.isAuthenticated, PrintController.printFile);

router.route('/admin-settings')
    .all(AuthController.isAuthenticated, AuthController.isAdmin)
    .get(AuthController.getAdminSettings)
    .post(validateBody(schemas.authSchema), AuthController.addNewUser);


module.exports = router;


