var httpRequest;

function makeRequest(url) {
	httpRequest = new XMLHttpRequest();
	if (!httpRequest) {
		alert('Giving up :( Cannot create an XMLHTTP instance');
		return false;
	}
	httpRequest.onreadystatechange = printContents;
	httpRequest.open('GET', url);
	httpRequest.setRequestHeader("x-api-user", "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX");
	httpRequest.setRequestHeader("x-api-key", "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX");
	httpRequest.send();
}

function alertContents() {
	if (httpRequest.readyState === 4) {
		if (httpRequest.status === 200) {
			alert(httpRequest.responseText);
		} else {
			alert('There was a problem with the request.');
		}
	}
}

function printContentsBare() {
	if (httpRequest.readyState === 4) {
		if (httpRequest.status === 200) {
			var div = document.createElement('div');
			div.innerHTML = httpRequest.responseText;
			document.body.appendChild(div);
			var payload = JSON.parse(httpRequest.responseText);
			console.log(payload);
		} else {
			alert('There was a problem with the request.');
		}
	}
}

function printContents(){
	if (httpRequest.readyState === 4) {
		if (httpRequest.status === 200) {
			var habits = [];
			var dailies = [];
			var todos = [];
			var mainDiv = document.createElement('div');
			var payload = JSON.parse(httpRequest.responseText);
			//console.log(payload);
			/*
			for each in payload
				if type = habit:
					put in array
			*/
			for(var i=0;i<payload.length;i++){
				if(payload[i].type == "habit"){
					habits.push(payload[i]);
				}else if(payload[i].type == "daily"){
					dailies.push(payload[i]);
				}else if(payload[i].type == "todo"){
					todos.push(payload[i]);
				}else{
					//what
					alert("Problem: " + payload[i].text);
				}
			}
			//now iterate each 
			mainDiv.appendChild(makeSection(habits, "Habits"));
			mainDiv.appendChild(makeSection(dailies, "Dailies"));
			mainDiv.appendChild(makeSection(todos, "todos"));
			//finally:
			document.body.appendChild(mainDiv);
		} else {
			alert('There was a problem with the request.');
		}
	}
}

function makeSection(sectionArray, name){
	var section = document.createElement('div');
	section.innerHTML = "<h2>" + name + "</h2>";
	for(var i=0;i<sectionArray.length;i++){
		var task = document.createElement('div');
		task.innerHTML = sectionArray[i].text;
		section.appendChild(task);
	}
	return section;
}

makeRequest("https://habitrpg.com:443/api/v2/user/tasks");