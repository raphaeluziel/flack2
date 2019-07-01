document.addEventListener('DOMContentLoaded', () => {

  // Control which sections are visible and which buttons are disabled
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

  // Send an initial message when user joins or comes back to a room
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

  // Change user
  document.getElementById("change_user").onclick = () => {
    document.querySelector('.welcome').style.display = "block";
  }

  // Change channel
  document.getElementById("change_channel").onclick = () => {
    document.querySelector('.channel').style.display = "block";
    document.querySelector('.message').style.display = "none";
  }

  // Hold current channels received from server to check for duplicates
  var current_channel_list = [];

/*
  // Variable to hold file name ****************************************************************
  var file = '';

  // Upload file ********************************************************************************
  document.getElementById("paperclip").onclick = () => {
    document.getElementById("open_file").click();
    document.getElementById("open_file").onchange = () => {
      if (event.target.files){
        console.log(event.target.files[0]);
        file = event.target.files[0].name;
      }
    };
  };
  // BLOB **********************************************************************************
  var myBlob = new Blob(["This is my blob content"], {type : "text/plain"});
*/

  // Start the socket connection
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
  socket.on('connect', () => {

    // Get channel and user list from server
    socket.emit('process user', '');
    socket.emit('process channel', '');

    // If user already chose a display name, greet and go to channel selection
    if (localStorage.getItem('display_name')){
      document.querySelector("#username").innerHTML = localStorage.getItem('display_name');
      enableSection('channel');
    }

    // If user already chose a channel, allow them to resume messaging
    if (localStorage.getItem('channel')){
      document.querySelector("#channel_chosen").innerHTML = localStorage.getItem('channel');
      enableSection('message');
      sendInitialMessage(' has joined the conversation in the channel, ');
    }

    // Submit new display name name request to server
    document.querySelector('#submit_display_name').onclick = () => {
      username = document.querySelector('#display_name').value;
      // Button should do nothing if fields are blank
      if (username != ''){
        document.querySelector("#username").innerHTML = username;
        localStorage.setItem("display_name", username);
        // Clear the input for new user info
        document.querySelector("#display_name").value = '';
        // Send new user to server
        socket.emit('process user', username);
        // Call this to enable the channel buttons
        socket.emit('process channel', '');
        enableSection('channel');
      }
      // Prevent page from refreshing after form submission
      return false;
    };

    // Submit new channel request to server
    document.querySelector('#submit_channel').onclick = () => {
      channel = document.querySelector("#channel").value
      // Button does nothing unless channel field is filled in
      if (channel != ''){
        localStorage.setItem("channel", channel);
        // Clear the input for new inputs
        document.querySelector("#channel").value = "";
        // Display channels
        document.querySelector('#channel_chosen').innerHTML = channel;
      }

      // Is channel being requested a duplicate?
      if (current_channel_list.includes(channel)){
        document.querySelector('#channel_error').innerHTML = "channel already exists";
      }
      else{
        // Send channel to server
        socket.emit('process channel', channel);
        enableSection('message');
        sendInitialMessage(' has created a new channel, ');
      }
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
          //"file": file, //******************************************************************
          //"binary": ""
        };
        //////////////////console.log("SOCKET FILE", file); //***********************************************
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

    data.forEach(function(username){
      // Create list of each user in server
      //names += username + ', ';
    });
    //names = names.substring(0, names.length - 2) + '.';
    //document.querySelector('#user_list').innerHTML = names;
  });

  // Get current channel list from server
  socket.on('get channels', (data) => {

    // Store the channel list in lowercase to check if request is duplicate
    current_channel_list = data.map(chan => chan.toLowerCase());

    // Clear the list first
    document.querySelector('#channel_list').innerHTML = '';

    // Create button for each channel in list received by server
    data.forEach(function(channel){
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
      li.innerHTML = '<b>' + message.username + '</b> <i style="font-size:70%;">(' + message.timestamp + ')</i><br>&nbsp;&nbsp;&nbsp;&nbsp;<i>' + message.message + '</i>';

      /*
      if (message.file){
        li.innerHTML = '<b>' + message.username + '</b> <i style="font-size:70%;">(' + message.timestamp + ')</i><br>&nbsp;&nbsp;&nbsp;&nbsp;<i>' + message.message + '<br>&nbsp;&nbsp;&nbsp;&nbsp;attachment: ' + message.file + '</i>';
      }
      else{
        li.innerHTML = '<b>' + message.username + '</b> <i style="font-size:70%;">(' + message.timestamp + ')</i><br>&nbsp;&nbsp;&nbsp;&nbsp;<i>' + message.message + '</i>';
      }
      */

      document.querySelector('#message_list').append(li);
      
      // Force scrollbar to bottom
      document.querySelector(".message_box").scrollTop = document.querySelector(".message_box").scrollHeight;
    });
  });

});
