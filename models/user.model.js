'use strict';

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

mongoose.Promise = global.Promise;

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {type: String, default: ''}
});

userSchema.methods.serialize = function() {
  return {
    username: this.username || '',
    firstName: this.firstName || ''
  };
};

userSchema.pre('save', function userPreSave(next) {
  const user = this;
  if (this.isModified('password') || this.isNew) {
    return bcrypt.hash(user.password, 10)
      .then((hash) => {
        user.password = hash;
        return next();
      })
      .catch(error => next(error));
  }
  return next();
})

userSchema.plugin(uniqueValidator);

userSchema.methods.validatePassword = function userValidatePassword(password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = { User };
