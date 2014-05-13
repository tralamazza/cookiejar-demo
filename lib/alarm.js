var EventEmitter = require('events').EventEmitter;
var utils = require('util');
var config = require('./config');
var noble = require('noble');


var Alarm = function () {
	EventEmitter.call(this);
	var self = this;

	/* read values from BLE */
	function read_from_sensor(per, readings_cb) {
		per.readHandle(config.sensor.handle, function (err, buf) {
			if (err) return readings_cb(err);
			var i = 0;
			var readings = {};
			['white', 'red', 'green', 'blue', 'proximity'].forEach(function (prop) {
				readings[prop] = (buf[i+1] << 8) | buf[i];
				i += 2;
			});
			readings_cb(err, readings);
		});
	}

	var armed = true;

	self.rearm = function () {
		armed = true;
	};

	/* poll sensor data using read_from_sensor.
	 * this call with prevent concurrent use of the snapshot function */
	function set_poll_interval(per, delay) {
		return setInterval(function () {
			if (!armed) return; // stop reading once we fired (but we might have in-flight readings)
			read_from_sensor(per, function (err, readings) {
				if (err) return self.emit('error', err);
				if (armed && readings.proximity > config.sensor.threshold) {
					armed = false;
					self.emit('theft', readings);
				}
			});
		}, delay);
	}

	/* discover BLE */
	noble.on('discover', function (per) {
		console.log('Found', per.uuid);
		// only ours matter
		if (per.uuid !== config.sensor.uuid) return;
		// we need to connect before reading
		per.connect(function (err) {
			if (err) return self.emit('error', err);
			process.on('exit', function () {
				per.disconnect();
			});
			console.log('Connected to', per.uuid);
			// no need to scan for it anymore
			noble.stopScanning();
			// sets interval timer
			var inthandle = set_poll_interval(per, 100);
			// disconnect callback, necessary to remove the listener
			// or else we get multiple calls
			function on_disconnect(a) {
				console.log('Disconnected.');
				// stop our timer
				clearInterval(inthandle);
				// remove the listener
				per.removeListener('disconnect', on_disconnect);
				console.log('Restart scanning...');
				// restart scanning
				noble.startScanning([]);
			}
			per.on('disconnect', on_disconnect);
		});
	});

	console.log('Start scanning...');
	noble.startScanning([]); // XXX filtering the uuid doesn't seem to work

	return self;
};

utils.inherits(Alarm, EventEmitter);

module.exports = function () {
	return new Alarm();
};
