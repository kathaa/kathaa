var io = require('socket.io')();
var express = require('express');
var jsonfile = require('jsonfile');
var util = require('util');
var utf8 = require('utf8');

var kue = require('kue'),
  _kue = kue.createQueue();


var kathaaOrchestrator = require('./kathaa-orchestrator');

//Load Module Libraries
var file = __dirname+"/module_library/package.json";
var module_package = jsonfile.readFileSync(file);
var module_library = {}
module_library.component_library = {}
module_library.library_object = {}
module_library.processes = {}
module_library.process_definitions = {}

module_package.files.forEach(function(element, index, array){
  jsonConcat(module_library.component_library, jsonfile.readFileSync(__dirname+"/module_library/"+element));

  var library_definition_file = element.split(".");
  library_definition_file.pop();
  library_definition_file.push("js");
  library_definition_file = library_definition_file.join(".");

  var library_definition = require(__dirname+"/module_library/"+library_definition_file);  
  for(_process in library_definition.prototype){
    module_library.processes[_process] = library_definition.prototype[_process];
    module_library.process_definitions[_process] = library_definition.prototype[_process].toString();
    module_library.library_object[_process] = library_definition;
  }
})


// Note : Every registered component of the type "core/component_name" has to have a 
// corresponding process of the name "core_component_name" ( '/' replace with '_' )
// module_library.processes["core_sentence_input"](null,null,null);

//Express Server defitnition
var app = express();
app.use(express.static(__dirname+"/kathaa"))
app.listen(8000);


//Socket.IO Definitions
io.of('/kathaa')
  .on('connection', function(client){
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