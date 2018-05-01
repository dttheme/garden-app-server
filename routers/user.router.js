'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const config = require('../config')

const disableWithToken = require('../middleware/disableWithToken.middleware').disableWithToken;
const requiredFields = require('../middleware/requiredFields.middleware');
const User = require('../models/user.model');
const localStrategy = require('../auth/jwt.strategy');
require('../auth/jwt.strategy')(passport);

const router = express.Router();

//access user info
router.route('/')
  .get(passport.authenticate('jwt', { session: false }), (req, res) => {
    User.findById(req.params._id)
    res.status(200).json(req.user)
    .catch(error => {
      res.status(500).json({ message: 'Internal server error' });
    });
  })

//login user
  .post(disableWithToken, requiredFields('username', 'password'), (req, res) => {
    User.findOne({ username: req.body.username })
    .then((foundResult) => {
        if (!foundResult) {
          console.log("something")
            return res.status(400).json({
                message: 'Email or password is incorrect',
            });
        } else {
          return foundResult;
        }
    })
    .then((foundUser) => {
        foundUser.comparePassword(req.body.password)
        .then((comparingResult) => {
            if (!comparingResult) {
                return res.status(400).json({
                    message: 'Email or password is incorrect',
                });
            }
            const tokenPayload = {
                _id: foundUser._id,
                username: foundUser.username,
                firstName: foundUser.firstName,
            };
            const token = jwt.sign(tokenPayload, config.JWT_SECRET, {
                expiresIn: config.JWT_EXPIRY,
            });
            return res.json({
              username: foundUser.username,
              firstName: foundUser.firstName,
              token: `Bearer ${token}`
            });
        });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
})
})

//register user
router.route('/signup')
  .post(disableWithToken, requiredFields('firstName', 'username', 'password'), (req, res) => {
    User.create({
      firstName: req.body.firstName,
      username: req.body.username,
      password: req.body.password
    })
    .then(() => res.status(201).send())
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    })
  })


module.exports = { router };
