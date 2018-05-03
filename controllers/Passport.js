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
        console.log('kekee', email, password);
        //Find user by email
        User.authenticate({
          email: email,
          password: password
        }, function (error, user) {
          if (error || !user) {
            return done(error);
          } else {
            return done(null, user);
          }
        })


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
