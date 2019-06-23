
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const teams = require('./const').teams

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

var confusion_matrix = () => {
  execStr = "hadoop jar $HADOOP_HOME/share/hadoop/tools/lib/hadoop-streaming-2.7.2.jar "
  execStr += "-mapper \"../confusion_matrix/mapper.py\" "
  execStr += "-reducer \"../confusion_matrix/reducer.py\" "
  execStr += "-input /data/mlb.csv "
  execStr += "-output /out"
  exec(execStr)
    .then((data) => {
      data = data.stdout.split("\n")
      data.pop();
      data = data.map((x) => (x.split("\t")[1]))

      var json = JSON.stringify({
        task: "confusion_matrix",
        message: data
      })

      return json

    }).then((json) => {
      wss.clients.forEach((client) => {
        client.send(json);
        console.log('Sent: ' + json);
      });
    })
}

var cross_entropy = () => {
  execStr = "hadoop jar $HADOOP_HOME/share/hadoop/tools/lib/hadoop-streaming-2.7.2.jar "
  execStr += "-mapper \"../cross_entropy/mapper.py\" "
  execStr += "-reducer \"../cross_entropy/reducer.py\" "
  execStr += "-input /data/mlb.csv "
  execStr += "-output /out"
  exec(execStr)
    .then((data) => {
      data = data.stdout.split("\n")
      data.pop();
      data = data.map((x) => {
        var name = x.split("\t")[0]
        var home = name.slice(0, 3)
        var away = name.slice(3, 6)

        if (!teams.includes(home) || !teams.includes(away)) {
          return {
            home : "",
            away : "",
            loss : 1
          }
        }

        var loss = x.split("\t")[1]
        return {
          home : home,
          away : away,
          loss : loss
        }
      })

      var json = JSON.stringify({
        task: "cross_entropy",
        message: data
      })

      return json

    }).then((json) => {
      wss.clients.forEach((client) => {
        client.send(json);
        //console.log('Sent: ' + json);
      });
    })
}

var plotelo = () => {
  exec("../data/plotelo.py", {maxBuffer: 1024 * 1100})
    .then((data) => (data.stdout))
    .then((data) => {
      json = JSON.stringify({
          task: "plotelo",
          img : data
        })
      wss.clients.forEach((client) => {
        client.send(json);
        //console.log('Sent: ' + json);
      });
    })
}

var plotwin = () => {
  exec("../data/plotwin.py", {maxBuffer: 1024 * 1100})
    .then((data) => (data.stdout))
    .then((data) => {
      json = JSON.stringify({
          task: "plotwin",
          img : data
        })
      wss.clients.forEach((client) => {
        client.send(json);
        console.log('Sent: ' + json);
      });
    })
}

var callback = () => {
  confusion_matrix();
  cross_entropy();
  plotelo();
  plotwin();
}

fs.watchFile('../data/mlb.csv', callback);

