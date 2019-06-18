
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

var http = require('http');
var express = require('express');
var WSS = require('ws').Server;

var app = express().use(express.static('public'));
var server = http.createServer(app);
server.listen(8080, '0.0.0.0');

var wss = new WSS({ port: 8081 });
wss.on('connection', (socket) => {
  console.log('Opened Connection 🎉');

  var json = JSON.stringify({ message: 'Gotcha' });
  socket.send(json);
  console.log('Sent: ' + json);

  /*socket.on('message', (message) => { // Receive
    console.log('Received: ' + message);

    wss.clients.forEach((client) => {
      var json = JSON.stringify({ message: 'Something changed' });
      client.send(json);
      console.log('Sent: ' + json);
    });
  });*/

  socket.on('close', function() {
    console.log('Closed Connection 😱');
  });

});

fs.watchFile('../data/mlb.csv', () => {
  exec("head -n10000 ../data/mlb.csv | ../confusion_matrix/mapper.py | sort | ../confusion_matrix/reducer.py").then((data) => {
    console.log(data);
    return data
  }).then((data) => {
    console.log(data.stdout.split("\n"))
    var json = JSON.stringify({
      message: data.stdout
    })
    console.log(json)
    return json
  }).then((json) => {
    wss.clients.forEach((client) => {
      client.send(json);
      console.log('Sent: ' + json);
    });
  })
});
