const mongoose = require('mongoose')
const { Model, Schema } = mongoose;
const bcrypt = require('bcrypt');

const schema = new Schema({
  name: String,
  email: {type: String, unique: true},
  password: String,
})


//authenticate input against database
schema.statics.authenticate = function (credentials, callback) {
  console.log('------------------------------------');
  console.log('Email and password', credentials);
  console.log(callback);
  console.log('------------------------------------');
  User.findOne({email: credentials.email})
  .exec(function (err, user) {
    console.log('Ima li ga?', user);
    if (err) {
      return callback(err)
    } else if (!user) {
      // var err = new Error('User not found.');
      // err.status = 401;
      return callback(err);
      console.log('Fuuuuck', err);
    }
    bcrypt.compare(credentials.password, user.password, function (err, result) {
      if (result === true) {
        console.log('Result', user);
       return callback(null, user);
      } else {
        return callback();
      }
    })
  });
}

schema.pre('save', function (next) {
  let user = this;
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});

class User extends Model {}

module.exports = mongoose.model(User, schema, 'User');
