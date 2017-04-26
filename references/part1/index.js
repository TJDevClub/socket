const express = require("express");
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket){
  console.log('found connection');
  
  socket.on('chat message', function(msg) {
      console.log("message: " + msg)
      io.emit('chat message', msg)
  })
  
//   socket.on('disconnect', function(){
//     console.log('connection disconnected');
//   });
});

http.listen(process.env.PORT || 3000, function(){
  console.log('Example app listening on port' + process.env.PORT + ' or 3000!')
});