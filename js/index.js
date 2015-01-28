window.onload = start;

function start() {
	getLocation();
	getTime();
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