// client ID: 281a2d6ed0fd6ac
// client secret: f45c422a8e3460d969739783bb278b921ccca16a

var client_id;
var type;
var callback_function;

// Accepts a json object and stores it
// for use during login.
function init(obj) {
	client_id = obj.client_id;
	type = obj.type;
	callback_function = obj.callback_function;
}

// Launches the Imgur OAuth flow in a new popup window,
// which will redirect to the Callback URL after success or failure.
function login() {
   var url = "https://api.imgur.com/oauth2/authorize?client_id=" + client_id + "&response_type=" + type + "&state=" + callback_function;
   window.open(url,'popUpWindow','height=500,width=500,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes');
}