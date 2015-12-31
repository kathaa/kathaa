var io = require('socket.io')();
var express = require('express');
var jsonfile = require('jsonfile');
var util = require('util');

//Load Module Libraries
var file = __dirname+"/module_library/package.json";
var module_package = jsonfile.readFileSync(file);
var module_library = {}
module_package.files.forEach(function(element, index, array){
  console.log(element);
  jsonConcat(module_library, jsonfile.readFileSync(__dirname+"/module_library/"+element));
})

//Express Server defitnition
var app = express();
app.use(express.static(__dirname+"/kathaa"))
app.listen(8000);


//Socket.IO Definitions
io.of('/kathaa')
  .on('connection', function(socket){
    console.log("Connected !!");
    //Instantiate Client
    socket.emit('init', {module_library: module_library});    

    socket.on('request', function (client) {
      // console.log(client);
      // var request_id = "request_"+random_string();
      // client.emit('request_ack', { response: "acknowledged", id: request_id });
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