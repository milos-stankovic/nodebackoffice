const { validate } = require("indicative");
const User = require("../models/User");
const passport = require("passport");
require("./Passport")(passport);

class Auth {
  home(req, res) {
    console.log({ amIAuthenticated: req.isAuthenticated()});
    res.render("index", { user: req.user });
  }

  /**
   *
   * @param req
   * @param res
   * @returns {*}
   */
  login(req, res) {
    return res.render("login");
  }

  /**
   *
   * @param req
   * @param res
   * @param next
   * @returns {*}
   */
  local_login(req, res, next) {
    passport.authenticate("local", (err, user, info) => {
      console.log("saksesful");
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect("/rrr");
      }
      req.logIn(user, err => {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    })(req, res, next);
    console.log("Logged In", res.user);
  }

  register(req, res) {
    return res.render("register");
  }

  /**
   * Returns User when successfully registered
   * @param req
   * @param res
   * @param next
   * @returns {*}
   */
  local_register(req, res, next) {
    //Todo: write new method(s) which will hold rules and messages for the login and register
    const rules = {
      email: "required|email",
      password: "required|min:6|max:30|confirmed",
      password_confirmation: "required|min:6|max:30",
      name: "required|min:2|max:15|alpha"
    };

    const data = {
      email: req.body.email,
      password: req.body.password,
      password_confirmation: req.body.password_confirmation,
      name: req.body.name
    };

    const messages = {
      "name.required": "Name is required.",
      "name.alpha": "Please choose a alphabetical username.",
      "email.required": "Enter a valid email address."
    };

    let validation = validate(data, rules, messages)
      .then(() => {
        User.findOne({ email: req.body.email }).then(user => {
          if (user) {
            res.render("register", {
              error: {
                email: "Email already exist in database. Choose other one.",
              },
              old: req.body
            });
          } else {
            const user = new User({
              name: req.body.name,
              email: req.body.email,
              password: req.body.password
            });
            user
              .save()
              .then(result => {
                res.redirect("/login"); //ToDo: Login user and redirect him to home page with welcome message.
              })
              .catch(err => {
                res.send(err);
              });
            console.log(user);
          }
        });
      })
      .catch(error => {
        console.log(error[0].field);
        res.render("register", { error, old: req.body });
      });
  }

  /**
   * Returns User if user session is still open
   * @param req
   * @param res
   * @param next
   * @returns {*}
   */
  me(req, res, next) {
    if (!req.user) {
      const error = new APIError(
        "Authentication error",
        httpStatus.UNAUTHORIZED
      );
      next(error);
    }

    res.json(req.user);
  }

  /**
   * Middleware to check user is authorised to access endpoint.
   * @param req
   * @param res
   * @param next
   * @returns {*}
   */
  checkAuth(req, res, next) {
    if (!req.user) {
      const error = new APIError(
        "Authentication error",
        httpStatus.UNAUTHORIZED
      );
      next(error);
    }

    next();
  }
}

module.exports = new Auth();
