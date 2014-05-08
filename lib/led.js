var gpios = require('./gpio');


var SetupLED = function(gpio_pin, callback) {
	// setup gpio pin
	gpios(gpio_pin, function (err, gpio) {
		if (err) return callback(err);
		// setup as output
		gpio.direction('out', function (err) {
			// return a function(value, cb)
			callback(err, function (value, cb) {
				gpio.value(value, cb);
			});
		});	
	});
};

module.exports = SetupLED;
