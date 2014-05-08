var fs = require('fs');
var path = require('path');


var SetupGPIO = function(gpio, callback) {
	var gpio_path = path.join('/sys/class/gpio/', 'gpio' + gpio);

	function exportGPIO () {
		var gpio_obj = { path: gpio_path };
		['direction', 'edge', 'value'].forEach(function (api) {
			gpio_obj[api] = function (val, val_cb) {
				fs.writeFile(path.join(gpio_path, api), val, val_cb);
				// TODO keep the file open?
			}
		});
		callback(null, gpio_obj);
	}

	// make sure it's exported
	fs.exists(gpio_path, function (exists) {
		if (exists) {
			exportGPIO();
		} else {
			fs.writeFile(path.join('/sys/class/gpio/export'), gpio, function (err) {
				if (err) {
					callback(err);
				} else {
					process.on('exit', function (code) {
						fs.writeFileSync(path.join('/sys/class/gpio/unexport'), gpio);
					});
					exportGPIO();
				}
			});
		}
	});
};

module.exports = SetupGPIO;
