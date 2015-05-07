//sort by date added
//fix so checkbox are always in sync

function makeRequest(verb, url, callback=false, content=false){
	var httpRequest = new XMLHttpRequest();

	if (!httpRequest) {
		alert('Giving up :( Cannot create an XMLHTTP instance');
		return false;
	}
	if(callback){
		httpRequest.onreadystatechange = function(){handler(httpRequest, callback);};
	}
	httpRequest.open(verb, url);
	httpRequest.setRequestHeader('Content-Type', 'application/json');
	if(content){
		httpRequest.send(content);
	}else{
		httpRequest.send();
	}
	return httpRequest.responseText;
}

function handler(httpRequest, callbackFunction){
	if (httpRequest.readyState === 4) {
		if (httpRequest.status === 200) {
			callbackFunction(httpRequest);
		} else {
			alert('There was a problem with the request.');
		}
	}
}

function test(httpRequest){
	console.log("Success!");
	console.log(httpRequest.responseText)
}

function logContents(httpRequest){
	console.log(httpRequest.responseText);
}

function assignContents(httpRequest){
	q = httpRequest.responseText;
}

function parseContents(httpRequest){
	console.log(JSON.parse(httpRequest.responseText));
}

function writeContents(httpRequest){
	var container = document.getElementById('task-list');
	container.innerHTML = "";
	var contents = JSON.parse(httpRequest.responseText);
	for(var each in contents){
		//make this a function
		var x = document.createElement('div');
		completed = contents[each]["dateCompleted"];
		id = each;
		name = contents[each]["name"];
		var string = '<input type="checkbox" id="' + id + '"';
		if(completed){
			x.className = 'complete';
			string += ' checked="checked"';
		}
		string += '>' + name;
		string += "";
		x.innerHTML = string;
		container.appendChild(x);
		clickURL = "http://localhost:8080/simpletodo/tasks/" + id;
		x.addEventListener("click", function(clickURL, x){return function(){makeRequest("POST", clickURL, false, content);if(x.className == 'complete'){x.className = ""}else{x.className = 'complete'}}}(clickURL, x));
	}
	document.body.appendChild(container);
}

function addContents(httpRequest){
	var container = document.getElementById('task-list');
	var a = JSON.parse(httpRequest.responseText);
	console.log(a);
	id = Object.keys(a);
	//make this a function
	var x = document.createElement('div');
	completed = a[id]["dateCompleted"];
	name = a[id]["name"];
	console.log(completed);
	var string = '<input type="checkbox" id="' + id + '"';
	if(completed){
		x.className = 'complete';
		string += ' checked="checked"';
	}
	string += '>' + name;
	string += "";
	x.innerHTML = string;
	container.appendChild(x);
	clickURL = "http://localhost:8080/simpletodo/tasks/" + id;
	x.addEventListener("click", function(clickURL, x){return function(){makeRequest("POST", clickURL, false, content);if(x.className == 'complete'){x.className = ""}else{x.className = 'complete'}}}(clickURL, x));
}

// var a = function(){makeRequest("GET", "https://habitrpg.com:443/api/v2/status");};
// var b = function(){makeRequest("GET", "https://habitrpg.com:443/api/v2/user/tasks");};
// a;
// b;

var x = {"name": "test"}
var content = JSON.stringify(x);

var a = document.getElementById("task-input");
var b = document.getElementById("task-submit");
var postNew = "http://localhost:8080/simpletodo/tasks"
b.addEventListener("click", function(){var content = '{"name": "' + a.value + '"}';makeRequest("POST", postNew, addContents, content);});
// b.addEventListener("click", console.log(a.value));
// b.addEventListener("click",	function(){console.log(a.value);});

// makeRequest("GET", "http://localhost:8080/simpletodo/tasks", logContents, content);
// makeRequest("POST", "http://localhost:8080/simpletodo/tasks", false, content);
// makeRequest("POST", "http://localhost:8080/simpletodo/tasks", false, content);
// makeRequest("POST", "http://localhost:8080/simpletodo/tasks", false, content);
// makeRequest("POST", "http://localhost:8080/simpletodo/tasks", false, content);
// makeRequest("GET", "http://localhost:8080/simpletodo/tasks", assignContents);
// console.log(x);
makeRequest("GET", "http://localhost:8080/simpletodo/tasks", writeContents);