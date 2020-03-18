//variables
let today= new Date();
let startmonth=today.getMonth();
let startyear=today.getFullYear();
let daysWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let months=["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let calendar = document.getElementById("calendar");

function updateCalendar(){
        $('calendar').remove(); //was advised by previous 330 students to remove the calendar object and create a new one
        var weeks = currentMonth.getWeeks();

        var body = document.getElementsByTagName('body')[0];
        var cal = document.createElement('calendar');
        var table_body = document.createElement('tbody');

        //puts the days of the week in the calendar
        var weekrow = document.createElement('tr');
        for(var i = 0; i<7; i++){
                var dayName = document.createElement("th");
                var name = document.createTextNode(daysWeek[i]);
                dayName.appendChild(name);
                weekrow.appendChild(dayName);
                table_body.appendChild(weekrow);
        }

        document.getElementById("displaymonth").innerHTML = months[currentMonth.month] + ", " + currentMonth.year;
        for(var w in weeks){
                var days = weeks[w].getDates();
                // days contains normal JavaScript Date objects.                                                
                let thisWeek = document.createElement('tr');
                for(var d in days){
                var today = document.createElement('td');
                        if (days[d].getMonth() != currentMonth.month) {
                          today.appendChild(document.createTextNode(" "));
                        }
                        else {
                         // alert(days[d].getDate());
                          today.setAttribute("id",days[d].getDate());
                         // today.setAttribute("id", days[d].getDate())
                          today.setAttribute("href", "");
                          today.appendChild(document.createTextNode(days[d].getDate()));
                          getEvents(days[d].getDate());
                        }
                        thisWeek.appendChild(today);
                }
                table_body.appendChild(thisWeek);
        }
                cal.appendChild(table_body);
                body.appendChild(cal);

}

function getEvents(day){
        if(logged_in === true){
                cmonth = currentMonth.month + 1;
                cyear = currentMonth.year;
                var dataString = "date=" + encodeURIComponent(day) + "&month=" + encodeURIComponent(cmonth) + "&year=" + encodeURIComponent(cyear);
                var xmlHttp = new XMLHttpRequest();
                xmlHttp.open("POST", "displevents.php", true);
                xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // It's easy to forget this line for POST requests
                xmlHttp.addEventListener("load", function(event) {
                var jsonData = JSON.parse(event.target.responseText);
                if (!jsonData.success){
                        alert("failed to fetch events");
                }
                else{
                        if (jsonData.exists){
//                              alert(day + "exists");
                                for (i = 0; i < jsonData.events.length; i++) {
//                              alert("inside for loop" + jsonData.events.length);
                                var eventdiv = document.createElement("div");
                                eventdiv.appendChild(document.createTextNode(jsonData.events[i].title + " " + jsonData.events[i].time));
                                eventdiv.setAttribute("class", "events");
                                eventdiv.setAttribute("id", jsonData.events[i].title + " " + day);
                                document.getElementById(day).appendChild(eventdiv);
                                }
                        }
                }
              }, false);
               xmlHttp.send(dataString);
          }
}

