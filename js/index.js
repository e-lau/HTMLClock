window.onload = start;

var fbUserId = 0;

function start() {
	getLocation();
	getTime();
	addAlarmOptions();
}

function deleteAllAlarms() {
	var deleteAlarmName = "";
	var AlarmObject = Parse.Object.extend("Alarm");
	var query = new Parse.Query(AlarmObject);
	query.find({
		success: function(results) {
			if (results.length == 0) {
				$("#alarms").append("<p>No Alarms Set</p>");
			}
			for (var i = 0; i < results.length; i++) { 
				results[i].destroy();
			}
		}
	});
}

function addAlarmOptions() {
	for (var i = 1; i <= 12; i++) {
		$("#hours").append("<option>" + i + "</option>");
	}
	for (var i = 1; i <= 59; i++) {
		$("#mins").append("<option>" + (i < 10 ? "0" : "") + i + "</option>");
	}
	
}

function getTime() {
	setTimeout(function(){ 
		var date = new Date();
		var hours = date.getHours().toString();
		var minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes().toString();
		var seconds = (date.getSeconds() < 10 ? "0" : "") + date.getSeconds().toString();
		document.getElementById("time").innerHTML = hours + ":" + minutes + ":" + seconds;
		getTime();
	}, 1000);
}

function getLocation() {
	// set to SLO by default
	var latitude = "35.300399";
	var longitude = "-120.662362";

	// get latitude and longitude, if possible
	if ("geolocation" in navigator) {
		navigator.geolocation.getCurrentPosition(function(position) {
			latitude = position.coords.latitude
			longitutde = position.coords.longitude;
		},
		// Failed
		function() {
			$("#currentCity").html("Could not retrieve location. Assuming. <br>");
		});
	}

	getForecast(latitude, longitude);

	// show city name based on latitude and longitude
	googleMapsEndpoint = 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+latitude+','+longitude+'&sensor=true';
	$.getJSON(googleMapsEndpoint, function(data) {
		$("#currentCity").append(data["results"][1]["formatted_address"]);
	}); 

}

function getForecast(latitude, longitude) {

	var forecastEndpoint = 
	"https://api.forecast.io/forecast/3ccc203618855e0326e50977e6a5cfda/" + latitude + "," + longitude + "?callback=?";
	
	$.getJSON(forecastEndpoint,
		function(data) {

			// set forecast label and icon
			$("#forecastLabel").html(data["daily"]["summary"]);
			var icon = data["daily"]["icon"];
			$("#forecastIcon").attr("src", "img/" + icon + ".png");

			// set background color
			var todayIndex = new Date().getDay();
			var todayTempMax = data["daily"]["data"][todayIndex]["temperatureMax"];

			var todayBackground = "nice;"

			if (todayTempMax >= 90) {
				todayBackground = "hot";
			}
			else if (todayTempMax >= 80) {
				todayBackground = "warm";

			}
			else if (todayTempMax >= 70) {
				todayBackground = "nice";
			}
			else if (todayTempMax >= 60) {
				todayBackground = "chilly";
			}
			else {
				todayBackground = "cold";
			}

			$("body").addClass(todayBackground);
		})
}


function showAlarmPopup() {
	$("#mask").removeClass("hide");
	$("#popup").removeClass("hide");
}

function hideAlarmPopup() {
	$("#mask").addClass("hide");
	$("#popup").addClass("hide");
}

function insertAlarm(hours, mins, ampm, alarmName, alarmID) {
	$("#noAlarms").remove();

	var elem = $("<div>");
	elem.addClass("flexible");
	elem.append("<div class='name' id='"+ alarmID +"'>" + alarmName + "</div>");
	elem.append("<div class='time'>" + hours + ":" + mins + " " + ampm + "</div>");

	var deleteButton = $("<div>");
	deleteButton.addClass("delete");
	deleteButton.html("delete");
	deleteButton.click(alarmID, deleteAlarm);
	elem.append(deleteButton);

	$("#alarms").append(elem);
}

function deleteAlarm(event) {
	var alarmID = event.data.toString();
	var AlarmObject = Parse.Object.extend("Alarm");
	var query = new Parse.Query(AlarmObject);
	query.find({
		success: function(results) {
			if (results.length == 1) {
				$("#alarms").append("<p id='noAlarms'>No Alarms Set</p>");
			}
			for (var i = 0; i < results.length; i++) { 
				var data = results[i]._serverData;
				if (alarmID == data.alarmID) {
            		// delete the object
            		results[i].destroy();
            		// remove delete button
            		$("#" + deleteAlarmName).next().next().remove();
            		// remove time
            		$("#" + deleteAlarmName).next().remove();
            		// remove name
            		$("#" + deleteAlarmName).remove();

            	}
            }
        }
    });
}

function addAlarm() {
	var hours = $("#hours option:selected").text();
	var mins = $("#mins option:selected").text();
	var ampm = $("#ampm option:selected").text();
	var alarmName = $("#alarmName").val();
	var alarmID = guid();

	var AlarmObject = Parse.Object.extend("Alarm");
	var alarmObject = new AlarmObject();
	alarmObject.save({"hours": hours, 
		"mins" : mins, 
		"ampm" : ampm, 
		"alarmID": alarmID,
		"userid" : fbUserId}, {
			success: function(object) {
				var data = object._serverData;
				insertAlarm(data.hours, data.mins, data.ampm, data.alarmName, alarmID);
				hideAlarmPopup();
			}
		});
}

function getAllAlarms(userid) {
	Parse.initialize("bsRZvYzk85qhpknoBH4zyJu4o6eTTcdZDjxtsCK9", "tRS7VGLsg0YDuiIhCf90Pwkh2raXiiphJXiFFd1H");
	var AlarmObject = Parse.Object.extend("Alarm");
	var query = new Parse.Query(AlarmObject);
	query.find({
		success: function(results) {
			if (results.length == 0) {
				$("#alarms").append("<p id='noAlarms'>No Alarms Set</p>");
			}
			for (var i = 0; i < results.length; i++) { 
				var data = results[i]._serverData;
				fbUserId = userid;
				if (data.userid == userid) {
					insertAlarm(data.hours, data.mins, data.ampm, data.alarmName);
				} 
			}
		}
	});
}


function guid() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, 
	function(c) 
	{
	    var r = Math.random() * 16|0, v = c == 'x' ? r : (r&0x3|0x8);
	    return v.toString(16);
	});
}



// Facebook Login

  // This is called with the results from from FB.getLoginStatus().
  function statusChangeCallback(response) {
  	console.log('statusChangeCallback');
  	console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      testAPI();
  } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
      'into this app.';
  } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      document.getElementById('status').innerHTML = 'Please log ' +
      'into Facebook.';
  }
}

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  function checkLoginState() {
  	FB.getLoginStatus(function(response) {
  		statusChangeCallback(response);
  	});
  }

  window.fbAsyncInit = function() {
  	FB.init({
  		appId      : '1551435141789991',
	    cookie     : true,  // enable cookies to allow the server to access 
	                        // the session
	    xfbml      : true,  // parse social plugins on this page
	    version    : 'v2.1' // use version 2.1
	});

	  // Now that we've initialized the JavaScript SDK, we call 
	  // FB.getLoginStatus().  This function gets the state of the
	  // person visiting this page and can return one of three states to
	  // the callback you provide.  They can be:
	  //
	  // 1. Logged into your app ('connected')
	  // 2. Logged into Facebook, but not your app ('not_authorized')
	  // 3. Not logged into Facebook and can't tell if they are logged into
	  //    your app or not.
	  //
	  // These three cases are handled in the callback function.

	  FB.getLoginStatus(function(response) {
	  	statusChangeCallback(response);
	  });

	};

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  function testAPI() {
  	console.log('Welcome!  Fetching your information.... ');
  	FB.api('/me', function(response) {
  		console.log('Successful login for: ' + response.name);
  		document.getElementById('status').innerHTML =
  		'Thanks for logging in, ' + response.name + '!';

  		$("#loginButton").remove();

  		getAllAlarms(response.id);
  	});
  }
