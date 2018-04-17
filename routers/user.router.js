'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const disableWithToken = require('../middleware/disableWithToken').disableWithToken;
const requiredFields = require('../middleware/requiredFields');
const { User } = require('../models/user.model');
const localStrategy = require('../auth/strategies');

const router = express.Router();



router.route('/')
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

  .get(passport.authenticate('jwt', { session: false }), (req, res) => {
    User.findById(req.params._id)
    res.status(200).json(req.user)
    .catch(error => {
      res.status(500).json({ message: 'Internal server error' });
    });
  });

  module.exports = { router };
