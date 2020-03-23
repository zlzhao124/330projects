//variables
let today = new Date();
let startmonth = today.getMonth();
let startyear = today.getFullYear();
let daysWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let calendar = document.getElementById("calendar");

function updateCalendar() {
        $('calendar').remove(); //was advised by previous 330 students to remove the calendar object and create a new one
        var weeks = currentMonth.getWeeks();

        var body = document.getElementsByTagName('body')[0];
        var cal = document.createElement('calendar');
        var table_body = document.createElement('tbody');

        //puts the days of the week in the calendar
        var weekrow = document.createElement('tr');
        for (var i = 0; i < 7; i++) {
                var dayName = document.createElement("th");
                var name = document.createTextNode(daysWeek[i]);
                dayName.appendChild(name);
                weekrow.appendChild(dayName);
                table_body.appendChild(weekrow);
        }

        document.getElementById("displaymonth").innerHTML = months[currentMonth.month] + ", " + currentMonth.year;
        for (var w in weeks) {
                //              alert("hello");
                var days = weeks[w].getDates();
                // days contains normal JavaScript Date objects.                                                
                let thisWeek = document.createElement('tr');
                for (var d in days) {
                        var today = document.createElement('td');
                        if (days[d].getMonth() != currentMonth.month) {
                                today.appendChild(document.createTextNode(" "));
                        }
                        else {
                                today.setAttribute("id", days[d].getDate());
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

function getEvents(day) {
        if (logged_in === true) {
                cmonth = currentMonth.month + 1;
                cyear = currentMonth.year;
                var dataString = "date=" + encodeURIComponent(day) + "&month=" + encodeURIComponent(cmonth) + "&year=" + encodeURIComponent(cyear);
                var xmlHttp = new XMLHttpRequest();
                xmlHttp.open("POST", "displevents.php", true);
                xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // It's easy to forget this line for POST requests
                xmlHttp.addEventListener("load", function (event) {
                        var jsonData = JSON.parse(event.target.responseText);
                        if (!jsonData.success) {
                                alert("failed to fetch events");
                        }
                        else {
                                //                      alert("reached" + day);
                                var button_IDs = []; //array of delete buttons
                                var ebutton_IDs = [];//array of edit buttons
                                if (jsonData.exists) {
                                        for (i = 0; i < jsonData.events.length; i++) {

                                                button_IDs[i] = i;
                                                ebutton_IDs[i] = i;
                                                var eventdiv = document.createElement("div");
                                                eventdiv.appendChild(document.createTextNode(jsonData.events[i].title + " " + jsonData.events[i].time));
                                                eventdiv.setAttribute("class", "events");
                                                eventdiv.setAttribute("id", jsonData.events[i].title + " " + jsonData.events[i].date);

                                                var del = document.createElement("button");
                                                del.textContent = "Delete Event";
                                                del.setAttribute("class", "deletebuttons");
                                                var primarykeystring = jsonData.events[i].date + " " + jsonData.events[i].title;
                                                del.setAttribute("id", primarykeystring);
                                                eventdiv.appendChild(del);
                                                button_IDs[i] = primarykeystring;

                                                var ed = document.createElement("button");
                                                ed.textContent = "Edit Event";
                                                ed.setAttribute("class", "editbuttons");
                                                var primarykeystring2 = "edit-" + jsonData.events[i].date + " " + jsonData.events[i].title;
                                                ed.setAttribute("id", primarykeystring2);
                                                eventdiv.appendChild(ed);
                                                ebutton_IDs[i] = primarykeystring2;
                                                document.getElementById(day).appendChild(eventdiv);
                                        }
                                }

                                if (button_IDs.length > 0) {

                                        for (j = 0; j < button_IDs.length; j++) {

                                                //      alert(day + " " + button_IDs.length);
                                                const idid = button_IDs[j];
                                                //      alert(button_IDs[j]);
                                                document.getElementById(button_IDs[j]).addEventListener("click", function () {
                                                        //alert(idid);
                                                        deleteEvent(idid);
                                                }, false);
                                        }
                                }

                                if (ebutton_IDs.length > 0) {
                                        console.log("a");
                                        for (k = 0; k < ebutton_IDs.length; k++) {
                                                //      alert(day + " " + button_IDs.length);
                                                const idi = ebutton_IDs[k];
                                                document.getElementById(ebutton_IDs[k]).addEventListener("click", function () {
                                                        editSetup(idi, day);
                                                }, false);

                                        }

                                }
                        }
                }, false);
                xmlHttp.send(dataString);
        }
}

function deleteEvent(string) {
        const dataString2 = "eventid=" + encodeURIComponent(string);

        var xmlHttp2 = new XMLHttpRequest();
        xmlHttp2.open("POST", "delete.php", true);
        xmlHttp2.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // It's easy to forget this line for POST requests
        xmlHttp2.addEventListener("load", function (event) {
                //  alert("reached2");
                var jsonData2 = JSON.parse(event.target.responseText);
                //      alert("reached3");
                if (jsonData2.success) {
                        alert("Event Deleted!");
                        updateCalendar();
                }
                else {
                        alert("Could not delete event. " + jsonData2.message);
                }
        }, false);
        xmlHttp2.send(dataString2);

}

function editSetup(string, string2) {
        console.log("b");
        opendialog();
        $("#add_event_btn").css("display", "none");
        $("#save_changes_btn").css("display", "inline");
        $("#date").css("display", "none");
        var x = currentMonth.month;
        var y = currentMonth.year;

        //document.getElementById("save_changes_btn").removeEventListener("click");
       //document.getElementById("save_changes_btn").setEventListener("click")
        document.getElementById("save_changes_btn").addEventListener("click", function () {
                // $("#save_changes_btn").css("display", "none");
                const t = document.getElementById("title").value;
                const time = document.getElementById("time").value;
                const notes = document.getElementById("description").value;

                const dataString = "title=" + encodeURIComponent(t) + "&time=" + encodeURIComponent(time) + "&notes=" + encodeURIComponent(notes) + "&original_id=" + encodeURIComponent(string);

                //  document.getElementById("save_changes_btn").addEventListener("click", function(){
                //alert(dataString);
                console.log("c");
                alert(t);
                alert(time);
                alert(notes);
                alert(string);
                var xmlHttp = new XMLHttpRequest();
                xmlHttp.open("POST", "edit.php", true);
                xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // It's easy to forget this line for POST requests
                xmlHttp.addEventListener("load", function (event) {
                        var jsonData = JSON.parse(event.target.responseText);
                        if (jsonData.success) {
                                alert("Event Updated!");
                                updateCalendar();
                        }
                        else {
                                alert("Could not update event. " + jsonData.message);
                        }

                }, false);
                xmlHttp.send(dataString);
                //updateCalendar();
                $("#dialog").css("display", "none");
                //$('#dialog').dialog('close');

                
        }, false);

}
