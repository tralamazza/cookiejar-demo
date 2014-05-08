var fs = require('fs');
var path = require('path');
var gpios = require('./gpio');

// TODO oh god please use async
var SetupButton = function(gpio_pin, callback) {
	gpios(gpio_pin, function (err, gpio) {
		if (err) return callback(err);
		gpio.direction('in', function (err) {
			if (err) return callback(err);
			gpio.edge('falling', function (err) {
				if (err) return callback(err);
				fs.watch(path.join(gpio.path, 'value'), function (evt, filename) {
					callback();
				});
			});
		});
	});
};

module.exports = SetupButton;
