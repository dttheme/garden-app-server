'use strict';

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const app = express();

const { PORT , DATABASE_URL } = require('./config');

const { Plant } = require('./models/plant.model.js');
const { User } = require('./models/user.model.js');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('common'));
app.use(express.static('public'));

const { router: gardenRouter } = require('./routers/garden.router.js');
const { router: userRouter } = require('./routers/user.router.js');

app.use('/garden', gardenRouter);
app.use('/users', userRouter);

app.use('*', function(req, res) {
  res.status(404).json({ message: 'Not found' });
});

mongoose.Promise = global.Promise;

let server;

function runServer(databaseUrl = DATABASE_URL, port) {

  return new Promise ((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port = (process.env.PORT || 8080), () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise(function(resolve, reject) {
      console.log(`Closing server`);
      server.close(err => {
        if(err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if(require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
