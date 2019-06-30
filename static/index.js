document.addEventListener('DOMContentLoaded', () => {

  function enableSection(section){
    var button = "submit_" + section;
    document.querySelector('.welcome').style.display = "none";
    document.getElementById(button).disabled = false;
    if (section == "message"){
      document.querySelector('.message').style.display = "block";
      document.querySelector('.channel').style.display = "none";
    }
    document.getElementById(section).focus();
  };

  function sendInitialMessage(message){
    when = new Date();
    initial_message = {
      "username": localStorage.getItem('display_name'),
      "channel": localStorage.getItem('channel'),
      "timestamp": when.toDateString() + ' at ' + when.toLocaleTimeString(),
      "message": localStorage.getItem('display_name') + message + localStorage.getItem('channel')
    };
    socket.emit('process message', initial_message);
  }

  document.getElementById("change_user").onclick = () => {
    document.querySelector('.welcome').style.display = "block";
  }

  document.getElementById("change_channel").onclick = () => {
    document.querySelector('.channel').style.display = "block";
    document.querySelector('.message').style.display = "none";
  }

  // Start the socket connection
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
  socket.on('connect', () => {

    // Get channel and user list from server
    socket.emit('process user', '');
    socket.emit('process channel', '');

    // If user already chose a display name
    if (localStorage.getItem('display_name')){
      // Welcome them by their username
      document.querySelector("#username").innerHTML = localStorage.getItem('display_name');
      enableSection('channel');
    }

    // Go to last channel user was in, if available
    if (localStorage.getItem('channel')){
      // Allow them to start messaging
      document.querySelector("#channel_chosen").innerHTML = localStorage.getItem('channel');
      enableSection('message');
      sendInitialMessage(' has joined the conversation in the channel, ');
    }

    // Submit new display name name request to server
    document.querySelector('#submit_display_name').onclick = () => {
      username = document.querySelector('#display_name').value;
      // Button should do nothing if display_name field is blank
      if (username != ''){
        document.querySelector("#username").innerHTML = username;
        localStorage.setItem("display_name", username);
        //Clear the input for new user info
        document.querySelector("#display_name").value = '';
        // Send new user to server
        socket.emit('process user', username);
        // Get a channel list to display as well
        socket.emit('process channel', '');
      }
      enableSection('channel');
      // Prevent page from refreshing after form submission
      return false;
    };

    // Submit new channel request to server
    document.querySelector('#submit_channel').onclick = () => {
      channel = document.querySelector("#channel").value
      // Button does nothing unless chennel field is filled in
      if (channel != ''){
        localStorage.setItem("channel", channel);
        // Clear the input for new inputs
        document.querySelector("#channel").value = "";
        // Display channels
        document.querySelector('#channel_chosen').innerHTML = channel;
        // Send channel to server
        socket.emit('process channel', channel);
      }
      enableSection('message');
      sendInitialMessage(' has created a new channel, ')
      // Prevent page from refreshing after form submission
      return false;
    };

    // Submit message to server for processing
    document.querySelector('#submit_message').onclick = () => {
      message = document.querySelector('#message').value;
      // Button should not send anything if field is blank
      if (message != ''){
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
      }
      // Prevent page from refreshing after form submission
      return false;
    };

  });


  // Get current user list from server
  socket.on('get users', (data) => {

    // Clear the list first
    // document.querySelector('#user_list').innerHTML = '';

    // Variable to hold all names on server
    var names = '';

    data.forEach(function(username){
      // Create list of each user in server
      names += username + ', ';
    });
    names = names.substring(0, names.length - 2) + '.';
    //document.querySelector('#user_list').innerHTML = names;
  });

  // Get current channel list from server
  socket.on('get channels', (data) => {

    // Clear the list first
    document.querySelector('#channel_list').innerHTML = '';

    data.forEach(function(channel){

      // Create button for each channel in list received by server
      const button = document.createElement('button');
      button.className = "btn btn-info btn-sm channel_buttons";
      button.innerHTML = channel;
      if (!localStorage.getItem("display_name")){
        button.disabled = true;
      }


      // Clicking button should switch channel, clear messages and enable messaging button
      button.onclick = function() {
        localStorage.setItem("channel", button.innerHTML);
        document.querySelector('#channel_chosen').innerHTML = button.innerHTML;
        document.querySelector('#message_list').innerHTML = '';
        enableSection('message');
        sendInitialMessage(' has joined the conversation in the channel, ');
      }

      // Add the button to the channel list
      document.querySelector('#channel_list').appendChild(button);
    });
  });

  // Get messages from server
  socket.on('get messages', (data) => {

    // Clear all messages
    document.querySelector('#message_list').innerHTML = '';

    data.forEach(function(message){

      // Create a new list item for each message received by server
      const li = document.createElement('li');
      li.innerHTML = '<b>' + message.username + '</b> (<i style="font-size:70%;">' + message.timestamp + '</i>)<br>&nbsp;&nbsp;&nbsp;&nbsp;<i>' + message.message + '</i>';
      document.querySelector('#message_list').append(li);

      // Force scrollbar to bottom
      document.querySelector(".message_box").scrollTop = document.querySelector(".message_box").scrollHeight;
    });
  });


});
