'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const { Plant } = require('../models/plant.model');

router.get('/', (req, res) => {
  Plant
    .find({author: req.user._id})
    .sort({createdAt: 'desc'})
    .then(plants = res.json(plants))
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    });
});

router.post('/', (req, res) => {
  Plant
    .create({
      type: req.body.type,
      date: req.body.date,
      number: req.body.number,
      location: req.body.location,
      water: req.body.water,
      author: req.user._id
    })
    .then(plant => res.status(201).json(plant))
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' })
    });
});

router.put('/:id', (req, res) => {
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

router.delete('/;id',(req, res) => {
  Plant
    .findByIdAndRemove(req.params.id)
    .then(plant => res.status(204).end())
    .catch(error =>{
      res.status(500).json({ message: 'Internal server error' });
    });
});

module.exports = { router };
