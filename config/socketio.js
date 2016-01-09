'use strict';

/**
 * Module dependencies.
 */
 const passportSocketIo = require("passport.socketio");
 const cookieParser = require('cookie-parser');
 var kathaaOrchestrator = require('./kathaa-orchestrator');
 var kue = require('kue'),
   _kue = kue.createQueue();

const env = process.env.NODE_ENV || 'development';

/**
 * Expose
 */

module.exports = function (socketio, app, module_library) {


  function onAuthorizeSuccess(data, accept){
    accept();
  }
  function onAuthorizeFail(data, message, error, accept){
    console.log("Authorization Failed :( ");
    if(error)
      accept(new Error(message));
  }


  socketio.use(passportSocketIo.authorize({
    cookieParser: cookieParser,       // the same middleware you registrer in express
    key:          'express.sid',       // the name of the cookie where express/connect stores its session_id
    secret:       'secret',    // the session_secret to parse the cookie
    store:        app.sessionMongoStore,        // we NEED to use a sessionstore. no memorystore please
    success:      onAuthorizeSuccess,  // *optional* callback on success - read more below
    fail:         onAuthorizeFail,     // *optional* callback on fail/error - read more below
  }));



  //Socket.IO Definitions
  socketio.on('connection', function(client){
      console.log(client.request.user);
      console.log("Connected !!");
      //Instantiate Client
      client.emit('init', {module_library: module_library.component_library, process_definitions: module_library.process_definitions});

      client.on('execute_workflow', function (message) {
        // client.emit('request_ack', { response: "acknowledged", id: request_id });

        var _kathaaOrchestrator = new kathaaOrchestrator(module_library, _kue, client);
        _kathaaOrchestrator.executeGraph(message.graph, message.beginNode);
        // client.emit("debug_message", message);
      });
    })
};
