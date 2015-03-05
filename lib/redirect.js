// Looks up the hash fragment, gets and stores
// the access token into the browser's local storage.
// Then invokes the original callback function, closes the
// current popup window, and on failure, logs an error.
function redirect_init() {

	// Check for error
	if (document.URL.indexOf("error") > -1) {
		var text = document.URL.split('error=')[1];
		console.log("Error: " + text);
		self.close();
		return;
	}

	// Get the access token
	var params = get_querystr_params();

	// Store access token into browser's local storage
	localStorage.setItem("access_token", params.access_token);

	// Then invoke the original callback function.
	var cbk_name = get_cbk_fn();
	window.opener[cbk_name]();

	// On failure, log the error and still close the current popup window.

	// Close the current popup window.
	self.close();

}

function get_cbk_fn() {
	var q = document.URL.split('?')[1];
	var state = q.split('#')[0];
	return state.split('=')[1];
}


function get_querystr_params() {
	var vars = [], hash;
    var q = document.URL.split('#')[1];
    if(q != undefined){
        q = q.split('&');
        for(var i = 0; i < q.length; i++){
            hash = q[i].split('=');
            vars.push(hash[1]);
            vars[hash[0]] = hash[1];
        }
    return vars;
	}
}