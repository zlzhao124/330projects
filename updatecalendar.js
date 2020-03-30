//variables that we will use in our code
let today = new Date();
let startmonth = today.getMonth();
let startyear = today.getFullYear();
let daysWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let calendar = document.getElementById("calendar");
let editcount = 0;
let setupcount = 0;
let sharecount = 0;
let sh_setupcount = 0;
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
                var days = weeks[w].getDates();
                // days contains normal JavaScript Date objects.                                                
                let thisWeek = document.createElement('tr');
                for (var d in days) {
                        var today = document.createElement('td');
                        if (days[d].getMonth() != currentMonth.month) {
				//puts blank space for ends of the month with days not in the actual month
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
//this will display the events our user has made onto our calendar. it is called by updatecalendar above
function getEvents(day) {
        if (logged_in === true) {

                var v1 =  document.getElementById('id1');
                var v2 =  document.getElementById('id2');
                var v3 =  document.getElementById('id3');
                var v4 =  document.getElementById('id4');
                var v5 =  document.getElementById('id5');
                var v6 =  document.getElementById('id6');
                var v7 =  document.getElementById('id7');
		var category = document.getElementById('id7');
		
		if (v1.checked == true){
			category = document.getElementById('id1');
		}
                if (v2.checked == true){
                        category = document.getElementById('id2');
                }
                if (v3.checked == true){
                        category = document.getElementById('id3');
                }
                if (v4.checked == true){
                        category = document.getElementById('id4');
                }
                if (v5.checked == true){
                        category = document.getElementById('id5');
                }
                if (v6.checked == true){
                        category = document.getElementById('id6');
                }
                if (v7.checked == true){
                        category = document.getElementById('id7');
                }
		var category_value = category.value;
                cmonth = currentMonth.month + 1;
                cyear = currentMonth.year;
                var dataString = "date=" + encodeURIComponent(day) + "&month=" + encodeURIComponent(cmonth) + "&year=" + encodeURIComponent(cyear) + "&category=" + encodeURIComponent(category_value);
                var xmlHttp = new XMLHttpRequest();
                xmlHttp.open("POST", "displevents.php", true);
                xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); 
                xmlHttp.addEventListener("load", function (event) {
                        var jsonData = JSON.parse(event.target.responseText);
                        if (!jsonData.success) {
                                alert("failed to fetch events");
                        }
                        else {
                                var button_IDs = []; //array of delete buttons
                                var ebutton_IDs = [];//array of edit buttons
				var sbutton_IDs = []; //array of share buttons
                                if (jsonData.exists) {
                                        for (i = 0; i < jsonData.events.length; i++) {
						//creates the event text node with title, time and category
                                                button_IDs[i] = i;
                                                ebutton_IDs[i] = i;
						sbutton_IDs[i] = i;
                                                var eventdiv = document.createElement("div");
                                                eventdiv.appendChild(document.createTextNode(jsonData.events[i].title + " " + jsonData.events[i].time + " Category: " + jsonData.events[i].category));
                                                eventdiv.setAttribute("class", "events");
                                                eventdiv.setAttribute("id", jsonData.events[i].title + " " + jsonData.events[i].date);
						//creates a delete button right below the event text with ID containing the event information
                                                var del = document.createElement("button");
                                                del.textContent = "Delete Event";
                                                del.setAttribute("class", "deletebuttons");
                                                var primarykeystring = jsonData.events[i].date + " " + jsonData.events[i].title;
                                                del.setAttribute("id", primarykeystring);
                                                eventdiv.appendChild(del);
                                                button_IDs[i] = primarykeystring;
						//creates an edit button right below the event text with ID containing the event information
                                                var ed = document.createElement("button");
                                                ed.textContent = "Edit Event";
                                                ed.setAttribute("class", "editbuttons");
                                                var primarykeystring2 = "edit-" + jsonData.events[i].date + " " + jsonData.events[i].title;
                                                ed.setAttribute("id", primarykeystring2);
                                                eventdiv.appendChild(ed);
                                                ebutton_IDs[i] = primarykeystring2;
                                              // creates a share button right below the event text with ID containing the event information

                                                var sh = document.createElement("button");
                                                sh.textContent = "Share Event";
                                                sh.setAttribute("class", "sharebuttons");
                                                var primarykeystring3 = "share-" + jsonData.events[i].date + " " + jsonData.events[i].title;
                                                sh.setAttribute("id", primarykeystring3);
                                                eventdiv.appendChild(sh);
                                                sbutton_IDs[i] = primarykeystring3;
                                                document.getElementById(day).appendChild(eventdiv);


                                        }
                                }

                                if (button_IDs.length > 0) {

                                        for (j = 0; j < button_IDs.length; j++) {
                                                const idid = button_IDs[j];
                                                document.getElementById(button_IDs[j]).addEventListener("click", function () {
                                                        deleteEvent(idid);
                                                }, false);
                                        }
                                }

                                if (ebutton_IDs.length > 0) {
                                        console.log("a");
                                        for (k = 0; k < ebutton_IDs.length; k++) {
                                                const idi = ebutton_IDs[k];
                                                document.getElementById(ebutton_IDs[k]).addEventListener("click", function () {
                                                        editSetup(idi, day);
                                                }, false);

                                        }

                                }

                                if (sbutton_IDs.length > 0) {
                                     
                                        for (l = 0; l < sbutton_IDs.length; l++) {
                                                const sh_id = sbutton_IDs[l];
                                                document.getElementById(sbutton_IDs[l]).addEventListener("click", function () {
                                                       $("#sharedialog").css("display", "inline");
							shareSetup(sh_id, day);
                                                }, false);

                                        }

                                }

                        }
                }, false);
                xmlHttp.send(dataString);
        }
}

function deleteEvent(string) {
	const tok = document.getElementById("csrf_token").value;
        const dataString2 = "eventid=" + encodeURIComponent(string) + "&token=" + encodeURIComponent(tok);

        var xmlHttp2 = new XMLHttpRequest();
        xmlHttp2.open("POST", "delete.php", true);
        xmlHttp2.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // It's easy to forget this line for POST requests
        xmlHttp2.addEventListener("load", function (event) {
                var jsonData2 = JSON.parse(event.target.responseText);
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
//opens up the add/edit dialog to prepare for edit
function editSetup(string, string2) {
	if (setupcount !== editcount){
		editcount = setupcount;
	}
        console.log("b");
	setupcount++;
	editcount++;
        opendialog();
        $("#add_event_btn").css("display", "none");
        $("#save_changes_btn").css("display", "inline");
        $("#date").css("display", "none");
        var x = currentMonth.month;
        var y = currentMonth.year;
	//below is the code that will call the ajax request and edit our event
        document.getElementById("save_changes_btn").addEventListener("click", function () {
                const t = document.getElementById("title").value;
                const time = document.getElementById("time").value;
                const notes = document.getElementById("category").value;
	        const tok = document.getElementById("csrf_token").value;	
		editcount++;
		const dataString = "title=" + encodeURIComponent(t) + "&time=" + encodeURIComponent(time) + "&notes=" + encodeURIComponent(notes) + "&original_id=" + encodeURIComponent(string) + "&token=" + encodeURIComponent(tok);
                console.log("c");
		if (setupcount * 2 == editcount){ //to avoid adding too many event listeners and updating the same event over and over, subsequently displaying it over and over
                var xmlHttp = new XMLHttpRequest();
                xmlHttp.open("POST", "edit.php", true);
                xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); 
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
                $("#dialog").css("display", "none");
               
		}
		
                
        }, false);

}


//opens up the share event dialog and prepares to share the event with another user, was implemented similar to editsetup above
function shareSetup(string, string2) {

        if (sharecount !== sh_setupcount){
                sharecount = sh_setupcount;
        }
        console.log("b");
        sharecount++;
        sh_setupcount++;

        var x = currentMonth.month;
        var y = currentMonth.year;


        document.getElementById("share_event_btn").addEventListener("click", function () {

                const su = document.getElementById("shared_user").value;

                sharecount++;
                const tok = document.getElementById("csrf_token").value;
                const dataString = "shared_user=" + encodeURIComponent(su) + "&original_id=" + encodeURIComponent(string) +  "&token=" + encodeURIComponent(tok);

                console.log("c");
                if (sh_setupcount * 2 == sharecount){ //to avoid adding too many event listeners and updating the same event over and over, subsequently displaying it over and over
                var xmlHttp = new XMLHttpRequest();
                xmlHttp.open("POST", "share.php", true);
                xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xmlHttp.addEventListener("load", function (event) {
                        var jsonData = JSON.parse(event.target.responseText);
                        if (jsonData.success) {
                                alert("Event Shared!");
                        }
                        else {
                                alert("Could not share event. " + jsonData.message);
                        }

                }, false);
                xmlHttp.send(dataString);
                $("#sharedialog").css("display", "none");
                }


        }, false);

}
