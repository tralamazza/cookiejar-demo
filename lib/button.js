var gpios = require('./gpio');


// TODO oh god please use async
var SetupButton = function(gpio_pin, callback) {
	gpios(gpio_pin, function (err, gpio) {
		if (err) return callback(err);
		gpio.direction('in', function (err) {
			if (err) return callback(err);
			gpio.edge('both', function (err) {
				if (err) return callback(err);
				gpio.watch(function (err, watcher) {
					watcher.on('interrupt', callback);
					watcher.on('error', callback);
				});
			});
		});
	});
};

module.exports = SetupButton;
