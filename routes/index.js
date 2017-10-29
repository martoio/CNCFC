var express = require('express');
var router = express.Router();

var authenticate = require('../auth/index');


/* GET home page. */
router.get('/', function(req, res, next) {
  let username = req.query.userame;
  let password = req.query.password;

  if(authenticate(req.query['username'], req.query['password'])){
    res.render('index', { title: 'Express' });
  } else {
    res.render('auth/login', {title: "Not Logged in!"});
  }
  
});

module.exports = router;


