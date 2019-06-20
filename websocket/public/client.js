(function ($) {
  var hexDigits = new Array("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"); 

  //Function to convert rgb color to hex format
  var rgb2hex = (rgb) => {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
  }

  var hex = (x) => {
    return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
  }

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
    data = JSON.parse(event.data)
    if (data.task === "cross_entropy") {
      data.message.map((msg) => {
        if (msg.home === "" || msg.away === "") {
          return
        } else {
          var num = msg.loss.slice(0, 6)
          console.log(num)
          var color = "rgb(" + String(Math.round(parseFloat(num)*700)) + "," + String(Math.round(parseFloat(num)*800)) + "," + String(Math.round(parseFloat(num)*900)) + ")"
          console.log(color)
          $($("td[id=" + msg.home + "][class=" + msg.away + "]")[0]).text(num)
          $($("td[id=" + msg.home + "][class=" + msg.away + "]")[0]).css('background-color', rgb2hex(color));
        }
      })
    }
    if (data.task === "confusion_matrix") {
      for(var _i = 0; _i < data.message.length; _i++) {
        $($("td[id=" + String(_i) + "]")[0]).text(data.message[_i])
        var curr = parseInt(data.message[_i])
        if (_i === 0 || _i === 2) {
          var num = curr / (parseInt(data.message[0]) + parseInt(data.message[2]))
          var color = "rgb(" + String(Math.round(parseFloat(num)*230)) + "," + String(Math.round(parseFloat(num)*230)) + "," + String(Math.round(parseFloat(num)*250)) + ")"
          $($("td[id=" + String(_i) + "][class=normalized]")[0]).text(String(num).slice(0, 6))
          $($("td[id=" + String(_i) + "][class=normalized]")[0]).css('background-color', rgb2hex(color));
        } else {
          var num = curr / (parseInt(data.message[1]) + parseInt(data.message[3]))
          var color = "rgb(" + String(Math.round(parseFloat(num)*230)) + "," + String(Math.round(parseFloat(num)*230)) + "," + String(Math.round(parseFloat(num)*250)) + ")"
          $($("td[id=" + String(_i) + "][class=normalized]")[0]).text(String(num).slice(0, 6))
          $($("td[id=" + String(_i) + "][class=normalized]")[0]).css('background-color', rgb2hex(color));
        }
      }
    }
    if (data.task === "plotelo") {
      if ($("div#plotelo > img").length != 0){
        $($("div#plotelo > img")[0]).remove()
      }
      $($("div#plotelo")[0]).append(data.img)
    }
    if (data.task === "plotwin") {
      if ($("div#plotwin > img").length != 0){
        $($("div#plotwin > img")[0]).remove()
      }
      $($("div#plotwin")[0]).append(data.img)
    }
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

  window.addEventListener('beforeunload', () => {
    socket.close();
  });

})(jQuery);
