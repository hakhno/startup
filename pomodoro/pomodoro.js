// this should save state to a server/db every minute eventually
// consider hanging everything off a main timer
// consider server-siding stuff too
// stick two initialTimes in, to track stalled execution time
//another timer that starts ticking on load, to see ho long before start-work is

var initialTime = Date.now();
var timeElapsed = 0;
var timeElapsedWork = 0;
var timeElapsedBreak = 0;
var timeElapsedRest = 0;
var timeElapsedPause = 0;
var pomodoroMode = "work";
var workTime = 1500;
var breakTime = 300;
var restTime = 2100;
var currentModeTimer = 0;
var pomodoroCycles = 0;
var cyclesPerRest = 4; 
var pauseMode = "";
var pauseTime = 0;

document.getElementById("pomodoro-start").addEventListener("click", pomodoroStartButton, false);
document.getElementById("pomodoro-pause").addEventListener("click", pomodoroTimerButton, false);
document.getElementById("pomodoro-stats-display").addEventListener("click", pomodoroStatsButton, false);

function pomodoroStartButton(){
	currentModeTimer = workTime;
	initialTime = Date.now();
	var pomodoroTime = window.setInterval(pomodoroTimer, 100);
	document.getElementById('pomodoro-mode').style.display = "block";
	document.getElementById('pomodoro-timer').style.display = "block";
	document.getElementById('pomodoro-pause').style.display = "block";
	document.getElementById('pomodoro-stats-display').style.display = "block";
	document.getElementById('pomodoro-start').style.display = "none";
}

function pomodoroTimer(){
	//testing - update counter display. need to factor
	//get elapsedTime
	var timeDifference = Date.now() - initialTime;
	var elapsed = Math.floor(timeDifference/1000);
	if(elapsed == timeElapsed + 1){
		document.getElementById('pomodoro-timer').innerHTML = '' + timeFormat(currentModeTimer, false);
		document.getElementById('pomodoro-mode').innerHTML = '' + pomodoroModeTitle(pomodoroMode);
		document.getElementById('counter-total').innerHTML = '' + timeFormat(timeElapsed, true);
		document.getElementById('counter-work').innerHTML = '' + timeFormat(timeElapsedWork, true);
		document.getElementById('counter-break').innerHTML = '' + timeFormat(timeElapsedBreak, true);
		document.getElementById('counter-rest').innerHTML = '' + timeFormat(timeElapsedRest, true);
		document.getElementById('counter-pause').innerHTML = '' + timeFormat(timeElapsedPause, true);
		pomodoroUpdateColour();
		timeElapsed++;
		//increment + decrement counters
		switch(pomodoroMode){
			case "work":
				timeElapsedWork++;
				currentModeTimer--;
				if(currentModeTimer == 0){
					pomodoroCycles++;
					if(pomodoroCycles%cyclesPerRest == 0){
						pomodoroMode = "rest"
						currentModeTimer = restTime;
					}else{
						pomodoroMode = "break"
						currentModeTimer = breakTime;
					}
				}
				break;
			case "break":
				timeElapsedBreak++;
				currentModeTimer--;
				if(currentModeTimer == 0){
					pomodoroMode = "work";
					currentModeTimer = workTime;
				}
				break;
			case "rest":
				timeElapsedRest++;
				currentModeTimer--;
				if(currentModeTimer == 0){
					pomodoroMode = "work";
					currentModeTimer = workTime;
				}
				break;
			case "pause":
				timeElapsedPause++;
				break;
			default:
				console.log("Error in Case Statement");
		}
	}else{
		//check for skip errors
		if(elapsed > timeElapsed + 1){
			//how do we fix this?
			console.log("Timeskip! elapsed: " + elapsed + "; timeDifference: " + timeDifference +"; timeElapsed: " + timeElapsed);
			//basically, hang the timer for a bit and just keep going
			initialTime += timeDifference - (timeElapsed * 1000);
		}
		//else do nothing til the next second
	}
}

function pomodoroTimerPause(){
	pauseMode = pomodoroMode;
	pauseTime = currentModeTimer;
	pomodoroMode = "pause";
	pomodoroUpdateColour();
	document.getElementById('pomodoro-mode').innerHTML = '' + pomodoroModeTitle(pomodoroMode);
}

function pomodoroTimerResume(){
	pomodoroMode = pauseMode;
	currentModeTimer = pauseTime;
	pauseMode = "";
	pomodoroUpdateColour();
	document.getElementById('pomodoro-mode').innerHTML = '' + pomodoroModeTitle(pomodoroMode);
}

function pomodoroTimerButton(){
	var button = document.getElementById('pomodoro-pause');
	if(pauseMode == ""){
		pomodoroTimerPause();
		button.innerHTML = "Resume";
	}else if(pomodoroMode == "pause"){
		pomodoroTimerResume();
		button.innerHTML = "Pause";
	}else{
		console.log("Pause button error");
	}
}

function pomodoroStatsButton(){
	var div = document.getElementById('pomodoro-stats');
	var button = document.getElementById('pomodoro-stats-display')
	if(div.style.display !== 'none'){
		div.style.display = 'none';
		button.innerHTML = "Stats";
	}else{
		div.style.display = 'block';
		button.innerHTML = "Hide";
	}
}

function pomodoroModeTitle(mode){
	switch(mode){
		case "work":
			return "Working";
			break;
		case "break":
			return "Short Break";
			break;
		case "rest":
			return "Long Break";
			break;
		case "pause":
			return "Paused";
			break;
		default:
			return "Error State";
	}
}

function timeFormat(time, showHours){
	var minutes = Math.floor(time/60);
	var seconds = time - minutes * 60;
	if(minutes >= 60 || showHours){
		var hours = Math.floor(minutes/60);
		minutes = minutes - (hours * 60);
		return leftPad(hours) + ":" + leftPad(minutes) + ':' + leftPad(seconds);
	}
	return leftPad(minutes) + ':' + leftPad(seconds);
}

function leftPad(aNumber){
	if(aNumber.toString().length >= 2){
		return aNumber;
	}
	return (Math.pow(10, 2) + Math.floor(aNumber)).toString().substring(1);
}
/* what to do:
have a base timer which is going the whole time and work from that
change modes and decrement/increment based on that
*/

function interpolateColour(minColor,maxColor,maxDepth,depth){
	function d2h(d) {return d.toString(16);}
	function h2d(h) {return parseInt(h,16);}

	if(depth == 0){
		return minColor;
	}
	if(depth == maxDepth){
		return maxColor;
	}
	 
	var color = "#";
	 
	for(var i=1; i <= 6; i+=2){
		var minVal = new Number(h2d(minColor.substr(i,2)));
		var maxVal = new Number(h2d(maxColor.substr(i,2)));
		var nVal = minVal + (maxVal-minVal) * (depth/maxDepth);
		var val = d2h(Math.floor(nVal));
		while(val.length < 2){
			val = "0"+val;
		}
		color += val;
	}
	return color;
}

function pomodoroUpdateColour(){
	//needs to account for mode colours
	switch(pomodoroMode){
		case "work":
			colour = interpolateColour("#27ae60", "#2ecc71", workTime - 1, currentModeTimer);
			document.getElementById('pomodoro-container').style.background = colour;
			break;
		case "break":
			colour = interpolateColour("#2980b9", "#3498db", breakTime, currentModeTimer);
			document.getElementById('pomodoro-container').style.background = colour;
			break;
		case "rest":
			colour = interpolateColour("#f39c12", "#f1c40f", restTime, currentModeTimer);
			document.getElementById('pomodoro-container').style.background = colour;
			break;
		case "pause":
			document.getElementById('pomodoro-container').style.background = "#999"
			break;
		default:
			console.log("Colour generation error");
	}
}