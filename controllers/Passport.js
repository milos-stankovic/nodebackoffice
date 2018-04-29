// load all the things we need
var LocalStrategy = require("passport-local").Strategy;

// load up the user model
var User = require("../models/User");

// expose this function to our app using module.exports
module.exports = function(passport) {
  passport.use(
    "local",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
        passwordField: "password"
      },
      function(req, email, password, done) {
        //Find user by email
        User.findOne({
          email,
          password
        })
          .then(function(user) {
            if (!user) {
              return done(null, false);
            }
            return done(null, user);
          })
          .catch(function(err) {
            // either findOne threw an exception or it returned a rejected promise
            return done(err);
          });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
