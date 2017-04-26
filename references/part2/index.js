const express = require("express");
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var rooms = ['global']
io.on('connection', function(socket){
  console.log('found connection');
  
  socket.on('adduser', function(username) {
      socket.username = username;
      socket.room = 'global';
      socket.join('global')

      socket.emit('updateChat', {room: 'global', user: 'SERVER', msg: 'you have connected to global'});
      socket.broadcast.to('global').emit('updateChat', {room: 'global', user: 'SERVER', msg: username + ' has connected to global'});

  })

  socket.on('updateChat', function(message) {
      /*
      data:
        msg - chat message sent 
        room_id - room id of the socket
      */
      io.sockets.in(socket.room).emit('updateChat', {user: socket.username, msg: message})
    //   console.log("message: " + message)
  })

  socket.on('enterRoom', function(room_id) {
      socket.leave(socket.room)
      var in_rooms = false;
      for (var i = 0; i < rooms.length; i ++){
          if(rooms[i] === room_id){
              in_rooms = true;
          }
      }
      if (!in_rooms){
          rooms.push(room_id)
      }
      socket.join(room_id)
      socket.room = room_id
    socket.emit('updateChat', {room: room_id, user: 'SERVER', msg: socket.username + ' has connected to ' + room_id});
      socket.broadcast.to(room_id).emit('updateChat', {user: 'SERVER', msg: socket.username + ' has connected to ' + room_id});
      
  })
  
  socket.on('disconnect', function(){
      socket.broadcast.emit('updateChat', {user: 'SERVER', msg: socket.username + ' has disconnected'})
      socket.leave(socket.room)

  });
});

http.listen(process.env.PORT || 3000, function(){
  console.log('Example app listening on port' + process.env.PORT + ' or 3000!')
});