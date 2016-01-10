'use strict';

/**
 * Module dependencies
 */

const inquirer = require('inquirer');
const fs = require('fs');
const join = require('path').join;
const mongoose = require('mongoose');
const config = require('../config/config');
const randomstring = require("randomstring");

const models = join(__dirname, '../app/models');


// Bootstrap models
fs.readdirSync(models)
  .filter(file => ~file.indexOf('.js'))
  .forEach(file => require(join(models, file)));

function connect () {
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  return mongoose.connect(config.db, options);
}

var db = connect();

db.connection.on('error', console.log)
  .once('open', listen);

function listen(){
  db.connection.db.dropDatabase();
  db.connection.close();
  console.log("Flushed the database :  "+config.db)
}
