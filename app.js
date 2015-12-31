var io = require('socket.io')();
var express = require('express');

//Express Server defitnition
var app = express();
app.use(express.static(__dirname+"/kathaa"))
app.listen(8000);


//Socket.IO Definitions
io.of('/kathaa')
  .on('connection', function(socket){
    console.log("Connected !!");
    socket.on('request', function (client) {
      console.log(client);
      var request_id = "request_"+random_string();
      client.emit('request_ack', { response: "acknowledged", id: request_id });

    });
  })
io.listen(8009);

//Helper functions
function random_string(){
  return Math.random().toString(36).substring(7);
}