'use strict';

/*!
 * nodejs-express-mongoose-demo
 * Copyright(c) 2013 Madhusudhan Srinivasa <madhums8@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies
 */

const fs = require('fs');
const join = require('path').join;
const express = require('express');
const socketio = require('socket.io');
const passportSocketIo = require("passport.socketio");
const mongoose = require('mongoose');
const passport = require('passport');
const config = require('./config/config');

var cookieParser = require('cookie-parser');

const models = join(__dirname, 'app/models');
const port = process.env.PORT || 8000;
const app = express();


/**
 * Expose
 */

module.exports = app;

// Bootstrap models
fs.readdirSync(models)
  .filter(file => ~file.indexOf('.js'))
  .forEach(file => require(join(models, file)));

// Bootstrap routes
require('./config/passport')(passport);
require('./config/express')(app, passport);
require('./config/routes')(app, passport);

// Collect Module Library
var module_library = require('./config/moduleLibrary')();

connect()
  .on('error', console.log)
  .on('disconnected', connect)
  .once('open', listen);

function listen () {
  if (app.get('env') === 'test') return;
  var server = app.listen(port);
  console.log('Express app started on port ' + port);

  //Setup Socket.IO
  var socketio = require('socket.io').listen(server);
  require('./config/socketio')(socketio, app, module_library);
  socketio.on('connection', function(){
        console.log("Working !!")
  });
  console.log('Socket.IO Server listening on port ' + port);
}

function connect () {
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  return mongoose.connect(config.db, options).connection;
}
