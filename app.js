var io = require('socket.io')();
var express = require('express');
var jsonfile = require('jsonfile');
var util = require('util');

var kue = require('kue'),
  _kue = kue.createQueue();


var kathaaOrchestrator = require('./kathaa-orchestrator');

//Load Module Libraries
var file = __dirname+"/module_library/package.json";
var module_package = jsonfile.readFileSync(file);
var module_library = {}
module_package.files.forEach(function(element, index, array){
  jsonConcat(module_library, jsonfile.readFileSync(__dirname+"/module_library/"+element));
})

//Express Server defitnition
var app = express();
app.use(express.static(__dirname+"/kathaa"))
app.listen(8000);


//Socket.IO Definitions
io.of('/kathaa')
  .on('connection', function(client){
    console.log("Connected !!");
    //Instantiate Client
    client.emit('init', {module_library: module_library});    

    client.on('execute_workflow', function (message) {
      // client.emit('request_ack', { response: "acknowledged", id: request_id });
      var _kathaaOrchestrator = new kathaaOrchestrator(module_library, _kue, client);

      _kathaaOrchestrator.executeGraph(message.graph, client);
    });
  })
io.listen(8009);

//Helper functions
function random_string(){
  return Math.random().toString(36).substring(7);
}

function jsonConcat(o1, o2) {
 for (var key in o2) {
  o1[key] = o2[key];
 }
 return o1;
}