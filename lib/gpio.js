var fs = require('fs');
var path = require('path');
var EventEmitter = require('events').EventEmitter;
var Epoll = require('epoll').Epoll;


var SetupGPIO = function(gpio, callback) {
	var gpio_path = path.join('/sys/class/gpio/', 'gpio' + gpio);

	function exportGPIO () {
		var gpio_obj = { path: gpio_path };
		// simple setters
		['direction', 'edge', 'value'].forEach(function (api) {
			gpio_obj[api] = function (val, val_cb) {
				fs.writeFile(path.join(gpio_path, api), val, val_cb);
				// TODO keep the file open?
			}
		});
		// watch for interrupts
		gpio_obj.watch = function (wa_cb) {
			var ee = new EventEmitter();
			fs.open(path.join(gpio_path, 'value'), 'r', function (err, fd) {
				if (err) return wa_cb(err);
				var buffer = new Buffer(1);
				var poller = new Epoll(function (err, fd, events) {
					if (err) return wa_cb(err);
					fs.read(fd, buffer, 0, 1, 0, function (err, size, buffer) {
						if (err)
							ee.emit('error', err);
						else
							ee.emit('interrupt', buffer.toString());
					});
				});
				// clear any pending interrupts
				fs.read(fd, buffer, 0, 1, 0, function (err, size, buffer) {
					ee.unwatch = function () {
						poller.remove(fd).close();
					};
					if (err) { 
						ee.unwatch();
						return wa_cb(err);
					}
					// poll for EPOLLPRI
					poller.add(fd, Epoll.EPOLLPRI);
					wa_cb(null, ee);
				});
			});
		};
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
