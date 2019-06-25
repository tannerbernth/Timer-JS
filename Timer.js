// Timer Class
class Timer {

	constructor(display, buttons) {
		// Timer
		this.display 		= display;
		this.hours 			= display.querySelector(".hours");
		this.minutes 		= display.querySelector(".minutes");
		this.seconds 		= display.querySelector(".seconds");
		this.milliseconds 	= display.querySelector(".milliseconds");

		// Buttons
		this.buttons 		= buttons;
		this.startButton 	= buttons.querySelector(".start");
		this.stopButton 	= buttons.querySelector(".stop");
		this.resetButton 	= buttons.querySelector(".reset");
		this.addButtonListeners();

		// Timer State
		this.startTime 		= 0; 
		this.stopTime 		= 0;
		this.isStopped 		= true;
	}

	// Timer Methods
	addButtonListeners() {
		this.startButton.addEventListener("click", this.start.bind(this));
		this.stopButton.addEventListener("click", this.stop.bind(this));
		this.resetButton.addEventListener("click", this.reset.bind(this));
	}
	
	start() {
		if (this.isStopped) {
			this.timer = setInterval(this.update.bind(this), 1);
			this.startTime = Date.now() - this.stopTime;
			this.isStopped = false;
		}
	}

	stop() {
		if (!this.isStopped) {
			clearInterval(this.timer);
			this.stopTime = Date.now() - this.startTime;
			this.isStopped = true;
		}
	}

	reset() {
		clearInterval(this.timer);
		this.formatTime(0);
		this.startTime = 0;
		this.stopTime = 0;
		this.isStopped = true;
	}

	update() {
		this.formatTime(Date.now() - this.startTime);
	}

	formatTime(time) {
		var h = time / 1000 / 60 / 60 % 24 | 0;
		var m = time / 1000 / 60 % 60 | 0;
		var s = time / 1000 % 60 % 60 | 0;
		var ms = time % 1000 % 60 % 60 | 0;

		this.hours.innerHTML = (h < 10 ? "0" + h : h);
		this.minutes.innerHTML = (m < 10 ? "0" + m : m);
		this.seconds.innerHTML = (s < 10 ? "0" + s : s);
		this.milliseconds.innerHTML	= (ms < 10 ? ":0" + ms : ":" + ms);
	}
}

// StopWatch Class
class StopWatch extends Timer {

	constructor(display, buttons, laps) {
		super(display, buttons);

		// Lap info
		this.lapDisplay = laps;
		this.laps = [];
		this.lapButton = this.buttons.querySelector(".lap");
		this.addLapButton();
	}

	addLapButton() {
		this.lapButton.addEventListener("click", this.lap.bind(this));
	}

	lap() {
		if (this.isStopped) {
			return;
		}
		var lapTime = this.startTime === 0 ? 0 : Date.now() - this.startTime;
		this.formatLapTime(lapTime)
		this.laps[this.laps.length] = lapTime;
	}

	// Override Timer.formatLapTime
	formatLapTime(time) {
		var h = time / 1000 / 60 / 60 | 0;
		var m = time / 1000 / 60 % 60 | 0;
		var s = time / 1000 % 60 % 60 | 0;
		var ms = time % 1000 % 60 % 60 | 0;

		var format = "Lap " + (this.laps.length+1) + ": "
				   + (h < 10 ? "0" + h : h) 
				   + (m < 10 ? ":0" + m : ":" + m);

		this.lapDisplay.innerHTML = this.laps.length === 0 
								  ? this.lapDisplay.innerHTML + format 
								  : this.lapDisplay.innerHTML + "<br>" + format;
	}

	reset() {
		super.reset();
		this.lapDisplay.innerHTML = "";
	}
}

class CountDown extends Timer {

	constructor(display, buttons) {
		super(display, buttons);
		this.days = display.querySelector(".days");
		this.addTimeDisplayListener();

	}

	addTimeDisplayListener() {
		this.days.addEventListener("blur", (function() { this.updateStartTime(this.days); }).bind(this));
		this.hours.addEventListener("blur", (function() { this.updateStartTime(this.hours); }).bind(this));
		this.minutes.addEventListener("blur", (function() { this.updateStartTime(this.minutes); }).bind(this));
		this.seconds.addEventListener("blur", (function() { this.updateStartTime(this.seconds); }).bind(this));

		this.days.addEventListener("click", (function() { this.clearInput(this.days); }).bind(this));
		this.hours.addEventListener("click", (function() { this.clearInput(this.hours); }).bind(this));
		this.minutes.addEventListener("click", (function() { this.clearInput(this.minutes); }).bind(this));
		this.seconds.addEventListener("click", (function() { this.clearInput(this.seconds); }).bind(this));
	}

	clearInput(input) {
		input.innerHTML = "";
	}

	updateStartTime(input) {
		if (isNaN(input.innerHTML))
			input.textContent = "00";
		else {
			var floor = Math.floor(input.textContent);
			input.textContent = floor < 10 ? "0" + floor : floor;
		}
		
		this.startTime = (this.days.textContent * 1000 * 60 * 60 * 24) 
					   + (this.hours.textContent * 1000 * 60 * 60)
					   + (this.minutes.textContent * 1000 * 60)
					   + (this.seconds.textContent * 1000);
		this.stopTime = 0;
		this.formatTime(this.startTime);

	}

	start() {
		if (this.isStopped && this.startTime > 0) {
			this.timer = setInterval(this.update.bind(this), 1);
			this.startTime = this.stopTime === 0 
						   ? this.startTime + Date.now() 
						   : this.stopTime + Date.now();
			this.isStopped = false;
		}
	}

	stop() {
		
		if (!this.isStopped) {
			clearInterval(this.timer);
			this.stopTime = this.startTime - Date.now();
			this.isStopped = true;
		}
	}

	update() {
		var now = Date.now();
		if (this.startTime - now <= 0)
			super.reset();
		else 
			this.formatTime(this.startTime - now);
	}

	formatTime(time) {
		super.formatTime(time);
		var d = time / 1000 / 60 / 60 / 24 | 0;
		var h = time / 1000 / 60 / 60 % 24 | 0;

		this.days.innerHTML	= (d < 10 ? "0" + d : d);
		this.hours.innerHTML = (h < 10 ? "0" + h : h);
	}
}

//Create a Timer Object for each group on the page in order
// Timer, StopWatch, CountDown
var groups = document.querySelectorAll(".group");
var display = document.querySelector(".timer");
var buttons = document.querySelector(".buttons");
var laps = document.querySelector(".laps");

for (var i = 0; i < groups.length; i++) {
	switch (i) {
		case 0:
			new Timer(groups[i].querySelector(".timer"), groups[i].querySelector(".buttons"));
			break;
		case 1:
			new StopWatch(groups[i].querySelector(".timer"), groups[i].querySelector(".buttons"), groups[i].querySelector(".laps"));
			break;
		case 2:
			new CountDown(groups[i].querySelector(".timer"), groups[i].querySelector(".buttons"));
			break;
		default: 
			new Timer(groups[i].querySelector(".timer"), groups[i].querySelector(".buttons"));
			break;
	}	
}