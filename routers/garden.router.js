'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', {session: false});

mongoose.Promise = global.Promise;

const { Plant } = require('../models/plant.model');

const dummyDb =
[{type: "Oregano", date: "03/15/18", number: 3, location: "patio", water: "once a week"},
{type: "Tomato", date: "02/02/18", number: 5, location: "backyard", water: "once a day"},
{type: "Succulents", date: "01/23/15", number: 1, location: "kitchen window", water: "once a month"}
];

//TODO add JWT to endpoints
router.get('/', jwtAuth, (req, res) => {
  Plant
    .find({author: req.user._id})
    .sort({createdAt: 'desc'})
    .then(plants => res.json(plants))
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    });
});

router.post('/', jwtAuth, (req, res) => {
  Plant
    .create({
      plantName: req.body.plantName,
      plantDate: req.body.plantDate,
      numberPlanted: req.body.numberPlanted,
      plantLocation: req.body.plantLocation,
      waterFrequency: req.body.waterFrequency,
      author: req.user._id
    })
    .then(plant => res.status(201).json(plant))
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' })
    });
});

router.put('/:id' ,jwtAuth, (req, res) => {
  const toUpdate = {};
  const updateableFields = ['type', 'date', 'number', 'location', 'water'];
  updateableFields.forEach(field => {
   if (field in req.body) {
     toUpdate[field] = req.body[field];
   }
 });
  Plant
    .findByIdAndUpdate(req.params.id, { $set: toUpdate })
    .then(updatedPost => res.status(204).end())
    .catch(error => {
      res.status(500).json({ message: 'Internal server error' })
    });
});

router.delete('/;id', jwtAuth, (req, res) => {
  Plant
    .findByIdAndRemove(req.params.id)
    .then(plant => res.status(204).end())
    .catch(error =>{
      res.status(500).json({ message: 'Internal server error' });
    });
});

module.exports = { router };
