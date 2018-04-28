// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User            = require('../models/User');

// expose this function to our app using module.exports
module.exports = function(passport) {


  passport.use('local', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'email',
    passwordField: 'password'

  },
  function(req, email, password, done) {
    console.log(req.body.email);
    //Find user by email
    User.findOne({
      email: req.body.email,
      password: req.body.password
    })
    .then(function(user) {
      // handle login here, user will be falsey if no user found with that email
      req.logIn(user, (err) => {
        if (err) { return err; }
        req.flash('success', { msg: 'Success! You are logged in.' });
        res.redirect(req.session.returnTo || '/');
      })(req, res, next);
      console.log('found', user);
    })
    .catch(function(err) {
      // either findOne threw an exception or it returned a rejected promise
      console.log('Login Error', err);
    });
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});


};

