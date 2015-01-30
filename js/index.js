window.onload = start;

function start() {
	getLocation();
	getTime();
	addAlarmOptions();
}

function addAlarmOptions() {
	for (var i = 1; i <= 12; i++) {
		$("#hours").append("<option>" +  (i < 10 ? "0" : "") + i + "</option>");
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

function insertAlarm(hours, mins, ampm, alarmName) {
	var elem = $("<div>");
	elem.addClass("flexible");
	elem.append("<div class='name'>" + alarmName + "</div>");
	elem.append("<div class='time'>" + hours + ":" + mins + " " + ampm + "</div>");
	$("#alarms").append(elem);
}

function addAlarm() {
	var hours, mins, ampm, alarmName;
	var hours = $("#hours option:selected").text();
	var mins = $("#mins option:selected").text();
	var ampm = $("#ampm option:selected").text();
	var alarmName = $("#alarmName").text();
	insertAlarm(hours, mins, ampm, alarmName);
	hideAlarmPopup();


}
