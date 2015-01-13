
window.onload = getTime;

function getTime() {
	setTimeout(function(){ 
		var date = new Date();
		var hours = date.getHours().toString();
		var minutes = date.getMinutes().toString();
		var seconds = date.getSeconds().toString();
		document.getElementById("time").innerHTML = hours + ":" + minutes + ":" + seconds;
		getTime();
	}, 1000);
}