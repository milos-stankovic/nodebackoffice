const mongoose = require('mongoose')
const { Model, Schema } = mongoose;

const schema = new Schema({
  name: String,
  email: {type: String, unique: true},
  password: String,
})

class User extends Model {}

module.exports = mongoose.model(User, schema, 'User');
