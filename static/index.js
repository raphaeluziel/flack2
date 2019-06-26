document.addEventListener('DOMContentLoaded', () => {

  // Functions to choose which sections to show or hide
  var show = function(sections)
  {
    Object.keys(sections).forEach(function(key){
      document.querySelector(key).style.display = sections[key];
    });
  };

  // Welcome section
  // If user already chose a display name skip welcome and go to topics section
  if (localStorage.getItem('display_name')){
    show({".welcome": "block", ".channel": "block", ".messaging": "none"});
    document.querySelector("#username").innerHTML = localStorage.getItem('display_name');
  }

  // Store username in localstorage, then move on to topics section
  document.querySelector("#submit_display_name").onclick = () =>
  {
    display_name = document.querySelector("#display_name").value;
    localStorage.setItem("display_name", display_name);
    document.querySelector("#username").innerHTML = display_name;
    show({".welcome": "block", ".channel": "block", ".messaging": "none"});
  }

  // Channels section
  document.querySelector("#submit_channel").onclick = () => {
    // Create a channel from input and store in localstorage
    channel = document.querySelector("#channel").value
    localStorage.setItem("channel", channel);
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
    // Clear the input for new inputs
    document.querySelector("#channel").value = "";
    // Go to the messaging section
    document.querySelector('#channel_chosen').innerHTML = channel;
    show({".welcome": "block", ".channel": "block", ".messaging": "block"});
  };

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
    };
  });

  socket.on('information', data => {
    console.log(data);
    var i = data.length;
    if (data[i-1].channel == localStorage.getItem('channel')){
      const li = document.createElement('li');
      li.innerHTML = '<b>' + data[i-1].username + '</b> (<i style="font-size:70%;">' + data[i-1].timestamp + '</i>)<br>&nbsp;&nbsp;&nbsp;&nbsp;<i>' + data[i-1].message + '</i>';
      document.querySelector('#message_list').append(li);
    }
  });


});
