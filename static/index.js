document.addEventListener('DOMContentLoaded', () => {

  console.log(localStorage.getItem('display_name'));

  if (!localStorage.getItem('display_name'))
  {
    document.querySelector(".welcome").style.display = "block";
    document.querySelector(".topics").style.display = "none";
  }
  else
  {
    document.querySelector(".welcome").style.display = "none";
    document.querySelector(".topics").style.display = "block";
    document.querySelector("#username").innerHTML = localStorage.getItem('display_name');
  }

  // Submit display name
  document.querySelector("#submit_display_name").onclick = () =>
  {
    display_name = document.querySelector("#display_name").value;
    localStorage.setItem("display_name", display_name);
    document.querySelector("#username").innerHTML = display_name;
    document.querySelector(".welcome").style.display = "none";
    document.querySelector(".topics").style.display = "block";
  }



});
