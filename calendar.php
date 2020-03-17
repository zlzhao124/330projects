<!DOCTYPE html>
<html lang='en'>
    <meta charset="utf-8" />
    <title>
        Calendar
    </title>
    <h1>
        Helen & Zach's Calendar
    </h1>
    <head>

        <link href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.2/themes/start/jquery-ui.css" type="text/css" rel="Stylesheet">
        <!-- We need the style sheet linked above or the dialogs/other parts of jquery-ui won't display correctly!-->
        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.3/jquery.min.js"></script>
        <!-- The main library. Note: must be listed before the jquery-ui library -->
        <script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.5/jquery-ui.min.js"></script>
        <!-- jquery-UI hosted on Google's Ajax CDN-->
        <link rel = "stylesheet" type = "text/css" href="login.css">
        <script src="http://classes.engineering.wustl.edu/cse330/content/calendar.min.js" type="text/javascript"></script>
        <script type="text/javascript" src="http://code.jquery.com/jquery-latest.js"></script>
       <!-- <script src=calendar.js></script> -->
        <link rel="stylesheet" type="text/css" href="calendar.css">
    </head>

<style>

#dialog{
    display: none
}
#logout{
    display: none
}
#add_event_trigger{
    display: none
}
head{
    text-align: center;
    }
body{
    background:url(bkgnd.jpg);
}
.calendar{
    text-align: center;
}

table{
    margin: auto;
}
th{
    border-left:8px solid rgb(117, 49, 106);
    border-right:8px groove rgb(170, 158, 236);
    border-bottom:8px groove rgb(170, 158, 236);
    border-top:8px groove rgb(117, 49, 106);

    width:180px;
    height:75px;
    font-size: 200%
}
td{
    width:180px;
    height:75px;
    font-size: 260%;
   
    border-left:8px solid rgb(66, 14, 73);;
    border-right:8px groove rgb(170, 158, 236);
    border-bottom:8px groove rgb(170, 158, 236);
    border-top:8px groove  rgb(66, 14, 73);
   

</style>

    <body>

<p id="welcomeMessage" class="welcomeMessage"></p>

<br><br>

    <button id="logout" >Log out</button>

    <button id="add_event_trigger" >Add Event</button>

        <div id="dialog">
                        <h1>Add Event</h1>
                        Event:<input type="text" name="title" id="title">
                        Date:<input type="date" name="date" id="date" >
                        Time:<input type="time" name="time" id="time"> 
                        Notes:<textarea name="description" id="description"></textarea>

                        <input type="submit" name="Add Event" value="Add Event" id="add_event_btn">
                        <input type="submit" value="Save Changes" id="save_changes_btn">
                        <input type="submit" value="Delete Event" id="delete_event_btn">
                        <input type="hidden" id="single_event_id">
                        <input type="hidden" id="csrf_token">
        </div>



    <div id="register">
        <b>Register New User:</b>
        <input id="r_username" type="text" name="r_username" placeholder="Username">
        <input id="r_password" type="text" name="r_password" placeholder="Password">
        <button id="register_btn">Register</button>
    </div>

        <br><br><br>
    <div id="login">
        <b>Login:</b>
        <input type="text" id="username" placeholder="Username" />
        <input type="text" id="password" placeholder="Password" />
        <button id="login_btn">Log In</button>
    </div>

         <h2 id="displaymonth"></h2>
         <button id="prev_month_btn">Previous Month &#10094;</button>
         <button id="next_month_btn">Next Month&#10095;</button>

<script type="text/javascript" src="updatecalendar.js"></script>
    <div id="table">
        <table id="calendar">
        </table>
    </div>




<script> 
function opendialog(event){
        $("#dialog").css("display", "inline");
        $("#save_changes_btn").css("display", "none");
        $("#delete_event_btn").css("display", "none");

        $("#dialog").dialog({
                title: "Add Event",
                draggable: true
                
        });

}
document.getElementById("add_event_trigger").addEventListener("click", opendialog, false);

function addevent(event){
  const t = document.getElementById("title").value;
  const d = document.getElementById("date").value;        
  const time = document.getElementById("time").value;
  const notes = document.getElementById("description").value;
  const dataString = "title=" + encodeURIComponent(t) + "&date=" + encodeURIComponent(d)  + "&notes=" + encodeURIComponent(notes);
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("POST", "addevent.php", true);
  xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // It's easy to forget this line for POST requests
  xmlHttp.addEventListener("load", function(event){
    var jsonData = JSON.parse(event.target.responseText);
    if (jsonData.success) {
      alert("Event Added!");
        $("#dialog").css("display", "none");
        $('#dialog').dialog('close');
    }
    else {
      alert("Could not add event. "+jsonData.message);
    }
  }, false);
  xmlHttp.send(dataString);
}
document.getElementById("add_event_btn").addEventListener("click", addevent, false);


function loggedin(username) {
            $("#login").css("display", "none");
            $("#register").css("display", "none");
            document.getElementById("welcomeMessage").textContent = "Hello our dear user, " + username + "! Welcome to the calendar!";
            $("#welcomeMessage").css("display", "inline");
            $("#logout").css("display", "inline");
            $("#add_event_trigger").css("display", "inline");
        }

//taken from the wiki
function loginAjax(event) {
    const username = document.getElementById("username").value; // Get the username from the form
    const password = document.getElementById("password").value; // Get the password from the form
    const dataString = "username=" + encodeURIComponent(username) + "&pass=" + encodeURIComponent(password);
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("POST", "login.php", true);
  xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // It's easy to forget this line for POST requests
  xmlHttp.addEventListener("load", function(event){
  var jsonData = JSON.parse(event.target.responseText);
    if (jsonData.success) {
      alert("Login success");
      loggedin(username); 
    }
    else {
      alert("You were not logged in "+jsonData.message);
    }
  }, false);
  xmlHttp.send(dataString);
}
document.getElementById("login_btn").addEventListener("click", loginAjax, false);


function registerAjax(event) {
  const newuser = document.getElementById('r_username').value;
  const newpass = document.getElementById('r_password').value;

  const dataString = "username=" + encodeURIComponent(newuser) + "&pass=" + encodeURIComponent(newpass);

  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("POST", "register.php", true);
  xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // It's easy to forget this line for POST requests
  xmlHttp.addEventListener("load", function(event){
    var jsonData = JSON.parse(event.target.responseText);
    if (jsonData.success) {
      alert("Registration success");
     // document.getElementById('register').style.visibility="hidden";
    }
    else {
      alert("Registration Failed. "+jsonData.message);
    }
  }, false);
  xmlHttp.send(dataString);
}
document.getElementById('register_btn').addEventListener('click', registerAjax, false);

function logoutAjax(event) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("POST", "logout.php", true);
  xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // It's easy to forget this line for POST requests
  xmlHttp.addEventListener("load", function(event){
    var jsonData = JSON.parse(event.target.responseText);
    if (jsonData.success) {
      alert("Logged out!");
            $("#login").css("display", "inline");
            $("#register").css("display", "inline");
            $("#welcomeMessage").css("display", "none");
            $("#dialog").css("display", "none");
            $("#logout").css("display", "none");
             $("#add_event_trigger").css("display", "none");
    }
    else {
      alert("Could not log out. "+jsonData.message);
    }
  }, false);
  xmlHttp.send(null);
}
document.getElementById('logout').addEventListener('click', logoutAjax, false);



function checkforlogin(event) {
  
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("POST", "checklogin.php", true);
  xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // It's easy to forget this line for POST requests
  xmlHttp.addEventListener("load", function(event){
    var jsonData = JSON.parse(event.target.responseText);
    if (jsonData.success) {
            $("#login").css("display", "inline");
            $("#register").css("display", "inline");
            $("#welcomeMessage").css("display", "none");
            $("#dialog").css("display", "none");
            $("#logout").css("display", "none");
            $("#add_event_trigger").css("display", "none");
    }
    else {
            loggedin(jsonData.message);
    }
  }, false);
  xmlHttp.send(null);
}
document.addEventListener("DOMContentLoaded", checkforlogin, false);

// For our purposes, we can keep the current month in a variable in the global scope
var currentMonth = new Month(2020, 2); // March 2020
updateCalendar();//loads the calendar immediately 
// Change the month when the "next" button is pressed
document.getElementById("next_month_btn").addEventListener("click", function(event){
        currentMonth = currentMonth.nextMonth(); // Previous month would be currentMonth.prevMonth()
        updateCalendar(); // Whenever the month is updated, we'll need to re-render the calendar in HTML
        //alert("The new month is "+currentMonth.month+" "+currentMonth.year);
}, false);

document.getElementById("prev_month_btn").addEventListener("click", function(event){
        currentMonth = currentMonth.prevMonth(); // Previous month would be currentMonth.prevMonth()
        updateCalendar(); // Whenever the month is updated, we'll need to re-render the calendar in HTML
        //alert("The new month is "+currentMonth.month+" "+currentMonth.year);
}, false);
</script>


    </body>
    </html>


