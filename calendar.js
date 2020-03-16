//variables
let today= new Date();
let currentMonth = new Month(2020, 3); 
let startmonth=today.getMonth();
let startyear=today.getFullYear();
let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let months=["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]; 
let calendar = document.getElementById("calendar");


document.addEventListener('DOMContentLoaded', function (event) {
    console.log("inside DOMContentLoaded");
    updateCalendar();
    updateEvents();
  
  }, false);

  function updateCalendar() {
	document.getElementById('Month').innerHTML = months[currentMonth.month];
	document.getElementById('Year').innerHTML = currentMonth.year;
	var weeks = currentMonth.getWeeks();
	let calendar = document.getElementById('calendar');
	calendar.innerHTML = "";

	for (var w in weeks) {
	  let thisWeek = document.createElement('tr');
	  var days = weeks[w].getDates();
	  for (var d in days) {
		var today = document.createElement('td');
		if (days[d].getMonth() != currentMonth.month) {
		  today.appendChild(document.createTextNode(" "));
		}
		else {
		  today.setAttribute("id", "day" + days[d].getDate())
		  today.setAttribute("href", "");
		  today.appendChild(document.createTextNode(days[d].getDate()));
		}
		thisWeek.appendChild(today);
	  }
	  calendar.appendChild(thisWeek);
	}
  }
  

//  function nextMonth(today){
//   currentMonth = currentMonth.nextMonth();
//  }

// function prevMonth(today){
//   currentMonth = currentMonth.prevMonth(); 
  
// }

// $(function () {
//  $("#nextbutton").on("click", () => {
//    nextMonth();
//    updateCalendar();
  
//  })
//  $("#previousbutton").on("click", () => {
//    prevMonth();
//    updateCalendar();

//  })
//   })

// Change the month when the "next" button is pressed
document.getElementById("nextbutton").addEventListener("click", function (event) {
	currentMonth = currentMonth.nextMonth(); // Previous month would be currentMonth.prevMonth()
	updateCalendar(); // Whenever the month is updated, we'll need to re-render the calendar in HTML
}, false);
// Change the month when the "previous" button is pressed
document.getElementById("previousbutton").addEventListener("click", function (event) {
	currentMonth = currentMonth.prevMonth();
	updateCalendar();
}, false);

  



function updateEvents(){

}

//functions in course wiki
(function () {
	"use strict";
	Date.prototype.deltaDays = function (n) {
		// relies on the Date object to automatically wrap between months for us
		return new Date(this.getFullYear(), this.getMonth(), this.getDate() + n);
	};
	Date.prototype.getSunday = function () {
		return this.deltaDays(-1 * this.getDay());
	};
}());


function Week(initial_d) {
	"use strict";
	this.sunday = initial_d.getSunday();
	this.nextWeek = function () {
		return new Week(this.sunday.deltaDays(7));
	};
	this.prevWeek = function () {
		return new Week(this.sunday.deltaDays(-7));
	};
	this.contains = function (d) {
		return (this.sunday.valueOf() === d.getSunday().valueOf());
	};
	this.getDates = function () {
		var dates = [];
		for(var i=0; i<7; i++){
			dates.push(this.sunday.deltaDays(i));
		}
		return dates;
	};
}

function Month(year, month) {
	"use strict";
	this.year = year;
	this.month = month;
	this.nextMonth = function () {
		return new Month( year + Math.floor((month+1)/12), (month+1) % 12);
	};
	this.prevMonth = function () {
		return new Month( year + Math.floor((month-1)/12), (month+11) % 12);
	};
	this.getDateObject = function(d) {
		return new Date(this.year, this.month, d);
	};
	this.getWeeks = function () {
		var firstDay = this.getDateObject(1);
		var lastDay = this.nextMonth().getDateObject(0);
		
		var weeks = [];
		var currweek = new Week(firstDay);
		weeks.push(currweek);
		while(!currweek.contains(lastDay)){
			currweek = currweek.nextWeek();
			weeks.push(currweek);
		}
		
		return weeks;
	};
}
