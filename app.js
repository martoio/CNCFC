require('dotenv').config();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var debug = require('debug')('cncfc:server');
var http = require('http');
const exphbs = require('express-handlebars');
const util = require('./util/index');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/CNCFC');

var index = require('./routes/index');

var app = express();

// view engine setup
app.engine('hbs', exphbs({
    defaultLayout: 'layout',
    extname: '.hbs',
    layoutsDir: __dirname+'/views/layouts'
}));
app.set('views', path.join(__dirname, 'views/'));
app.set('view engine', 'hbs');

//set session
app.use(session({
  secret: 'CNCFC',
  resave: false,
  saveUninitialized: false,
}));

// Custom flash middleware -- from Ethan Brown's book, 'Web Development with Node & Express'
app.use(function(req, res, next){
  // if there's a flash message in the session request, make it available in the response, then delete it
  res.locals.sessionFlash = req.session.sessionFlash;
  delete req.session.sessionFlash;
  next();
});



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//second static file import to point at the print-uploads folder. Convenience of getting the SVG preview working quickly
app.use(express.static(path.join(__dirname, 'print-uploads')));
app.use(express.static(path.join(__dirname, 'std-lib')));


app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//TODO: This needs serious cleanup:
/*const port = util.serverUtil.normalizePort(process.env.PORT || '3000');
app.set('port', port);

let server = http.createServer(app);
server.listen(port);
server.on('error', util.serverUtil.onError);
server.on('listening', util.serverUtil.onListening.bind(null, server));
module.exports = app;


let io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log(socket.id);

    // socket.on('message', console.log);
});
*/
module.exports = app;