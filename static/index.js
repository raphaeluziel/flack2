document.addEventListener('DOMContentLoaded', () => {

  // Welcome section
  // If user already chose a display name skip welcome and go to topics section
  if (localStorage.getItem('display_name')){
    document.querySelector('.channel').style.display = "block";
    document.querySelector("#username").innerHTML = localStorage.getItem('display_name');
  }

  // Store username in localstorage, then move on to topics section
  document.querySelector("#submit_display_name").onclick = () =>
  {
    display_name = document.querySelector("#display_name").value;
    localStorage.setItem("display_name", display_name);
    document.querySelector('.channel').style.display = "block";
    document.querySelector("#username").innerHTML = display_name;
  }

  // Start the socket connection
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
  socket.on('connect', () => {
    document.querySelector('#submit_message').onclick = () => {
      when = new Date();
      data = {
        "username": localStorage.getItem('display_name'),
        "channel": localStorage.getItem('channel'),
        "timestamp": when.toDateString() + ' at ' + when.toLocaleTimeString(),
        "message": document.querySelector('#message').value
      };
      socket.emit('process message', data);
      // Clear textarea
      document.querySelector('#message').value = '';
    };
    document.querySelector('#submit_channel').onclick = () => {
      channel = document.querySelector("#channel").value
      localStorage.setItem("channel", channel);
      // Clear the input for new inputs
      document.querySelector("#channel").value = "";
      // Go to the messaging section
      document.querySelector('#channel_chosen').innerHTML = channel;
      document.querySelector(".messaging").style.display = "block";
      socket.emit('process channel', channel);
    };
  });

  socket.on('get channels', (data) => {
    document.querySelector('#channel_list').innerHTML = '';

    data.forEach(function(channel){
      // Create buttons to access the channels
      const button = document.createElement('button');
      button.className = "btn btn-info";
      button.innerHTML = channel;
      button.onclick = function() {
        localStorage.setItem("channel", button.innerHTML);
        document.querySelector('#channel_chosen').innerHTML = button.innerHTML;
        document.querySelector('#message_list').innerHTML = '';
      }
      document.querySelector('#channel_list').appendChild(button);
    });
  });

  socket.on('get messages', (data) => {
    document.querySelector('#message_list').innerHTML = '';

    data.forEach(function(message){
      const li = document.createElement('li');
      li.innerHTML = '<b>' + message.username + '</b> (<i style="font-size:70%;">' + message.timestamp + '</i>)<br>&nbsp;&nbsp;&nbsp;&nbsp;<i>' + message.message + '</i>';
      document.querySelector('#message_list').append(li);
    });

  });


});
