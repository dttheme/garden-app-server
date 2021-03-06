'use strict';

const mongoose = require('mongoose');

const plantSchema = mongoose.Schema({
  plantName: String,
  plantDate: String,
  numberPlanted: Number,
  plantLocation: String,
  waterFrequency: { type: String, possibleValues: [`once a day`, `once a week`, `once a month`]},
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
},
  {timestamps: true}
);

const Plant = mongoose.model('Plant', plantSchema);

module.exports = { Plant };
