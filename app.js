var io = require('socket.io')();

io.of('/kathaa')
  .on('connection', function(socket){
    console.log("Connected !!");
    socket.on('command', function (command) {
      console.log(command);
      socket.emit('command_ack', { id: 'random_id' });    
    });
  })

io.listen(8009);