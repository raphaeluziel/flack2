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
  if (!localStorage.getItem('display_name')){
    show({".welcome": "block", ".channel": "none", ".messaging": "none"});
  }
  else{
    show({".welcome": "none", ".channel": "block", ".messaging": "none"});
    document.querySelector("#username").innerHTML = localStorage.getItem('display_name');
  }

  // Store username in localstorage, then move on to topics section
  document.querySelector("#submit_display_name").onclick = () =>
  {
    display_name = document.querySelector("#display_name").value;
    localStorage.setItem("display_name", display_name);
    document.querySelector("#username").innerHTML = display_name;
    show({".welcome": "none", ".channel": "block", ".messaging": "none"});
  }

  // Channels section
  document.querySelector("#submit_channel").onclick = () => {
    channel = document.querySelector("#channel").value
    localStorage.setItem("channel", channel);
    const li = document.createElement('li');
    li.innerHTML = "<a href='/" + channel + "'>" + channel + "</a>";
    document.querySelector("#channel_list").append(li);
    document.querySelector("#channel").value = "";
  };

  // Messaging section
  if(document.querySelector('#begin').innerHTML == "True"){
    show({".welcome": "none", ".channel": "none", ".messaging": "block"});
  }

});
