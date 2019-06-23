document.addEventListener('DOMContentLoaded', () => {

  // Functions to choose which sections to show or hide
  var show = function(sections)
  {
    Object.keys(sections).forEach(function(key){
      document.querySelector(key).style.display = sections[key];
    });
  };

  // On page load show the welcome section only
  show({".welcome": "block", ".topics": "none", ".messaging": "none"});

  // Has user already chosen a display name?
  if (!localStorage.getItem('display_name')){
    show({".welcome": "block", ".topics": "none", ".messaging": "none"});
  }
  else{
    show({".welcome": "none", ".topics": "block", ".messaging": "none"});
    document.querySelector("#username").innerHTML = localStorage.getItem('display_name');
  }

  // Submit display name
  document.querySelector("#submit_display_name").onclick = () =>
  {
    display_name = document.querySelector("#display_name").value;
    localStorage.setItem("display_name", display_name);
    document.querySelector("#username").innerHTML = display_name;
    show({".welcome": "none", ".topics": "block", ".messaging": "none"});
  }

});
