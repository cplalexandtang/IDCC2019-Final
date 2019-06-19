(function ($) {
  
  var socket = new WebSocket('ws://localhost:8081/');
  socket.onopen = (event) => {
    log('Opened connection 🎉');
    var json = JSON.stringify({ message: 'Hello' });
    socket.send(json);
    log('Sent: ' + json);
  }

  socket.onerror = (event) => {
    log('Error: ' + JSON.stringify(event));
  }

  socket.onmessage = (event) => {
    log('Received: ' + event.data);
  }

  socket.onclose = (event) => {
    log('Closed connection 😱');
  }

  $('#close').on('click', (event) => {
    socket.close();
    log('Closed connection 😱');
  });

  $('#send').on('click', (event) => {
    var json = JSON.stringify({ message: 'Hey there' });
    socket.send(json);
    log('Sent: ' + json);
  });

  var log = (text) => {
    var li = document.createElement('li');
    li.innerHTML = text;
    $('#log').append(li);
  }

  window.addEventListener('beforeunload', function() {
    socket.close();
  });

})(jQuery);
