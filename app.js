const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const edge = require('edge.js');
const passport = require("passport");
const session = require('express-session')
const swal = require('sweetalert2');


const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/nodebackoffice')
  .then(() =>  console.log('MongoDB connection successful'))
  .catch((err) => console.error(err));

const pe = require('pretty-error').start();
pe.skipNodeFiles(); // this will skip events.js and http.js and similar core node files
pe.skipPackage('express'); // this will skip all the trace lines about express` core and sub-modules

// route files
var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.use(require('express-edge'));
app.set('views', path.join(__dirname, 'views'));


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

// route prefixes defined for each route file
app.use('/', index);
app.use('/users', users);

/// catch 404 and forward to error handler
app.use(function(err,req, res, next) {
  res.status(err.status || 404);
  res.render('error', {
      message: err.message,
      error: err
  });
});

// error handler
app.use(function(err, req, res, next) {
  console.log('error', err);
  res.status(err.status || 500);
  res.render('error', {
      message: err.message,
      error: err
  });
});

module.exports = app;
