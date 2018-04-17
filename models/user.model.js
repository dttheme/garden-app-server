'use strict';

const mongoose = require('mongoose');

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

// userSchema.methods.validatePassword = function(password) {
  // return
// }
