var express = require('express');
const passport = require('passport');
var router = express.Router();
var auth = require("../controllers/Auth");

router.get('/', auth.home);

// route to register page
router.get('/register', auth.register);
router.post('/register', auth.local_register);

// route to login page
router.get('/login', auth.login);
router.post('/login', auth.local_login);

// // route for logout action
// router.get('/logout', auth.logout);

module.exports = router;
