const events = require('events');

const Ticker = function(interval) {
	var self = this, nextTick = function() {
		self.emit('tick');
		setTimeout(nextTick, interval);
	}

	nextTick();
}

Ticker.prototype = new events.EventEmitter;

const monitor = new Ticker(5000);

module.exports=monitor;
