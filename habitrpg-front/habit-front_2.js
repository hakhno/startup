var userid = "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX";
var apitoken = "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX";


function makeRequest(verb, url, callback) {
	var httpRequest = new XMLHttpRequest();

	if (!httpRequest) {
		alert('Giving up :( Cannot create an XMLHTTP instance');
		return false;
	}
	httpRequest.onreadystatechange = function(){callback(httpRequest);};
	httpRequest.open(verb, url);
	httpRequest.setRequestHeader("x-api-user", userid);
	httpRequest.setRequestHeader("x-api-key", apitoken);
	httpRequest.send();
}

function alertContents(httpRequest) {
	if (httpRequest.readyState === 4) {
		if (httpRequest.status === 200) {
			console.log(httpRequest.responseText);
			//temp
			var x = JSON.parse(httpRequest.responseText);
			for(var i=0;i<x.length;i++){
				if(x[i].text == "test"){
					console.log(i);
					console.log(x[i]);
				}
			}
		} else {
			alert('There was a problem with the request.');
		}
	}
}

// var a = function(){makeRequest("GET", "https://habitrpg.com:443/api/v2/status");};
// var b = function(){makeRequest("GET", "https://habitrpg.com:443/api/v2/user/tasks");};
// a;
// b;

// makeRequest("GET", "https://habitrpg.com:443/api/v2/user/tasks", alertContents);
// makeRequest("POST", "https://habitrpg.com:443/api/v2/user/tasks/3d41e1a3-1a12-4cf8-9ded-980d0f8811e4/up", alertContents)

/*
for each in the return
	split it into correct list
for each list
	for each item in list
		make a box with appropriate bits

also need to get the general cruft, handle items etc