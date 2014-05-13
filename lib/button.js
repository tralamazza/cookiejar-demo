var gpios = require('./gpio');
var EventEmitter = require('events').EventEmitter;
var utils = require('util');


// TODO oh god please use async
var Button = function (pin, edge) {
	EventEmitter.call(this);
	var self = this;
	
	gpios(pin, function (err, gpio) {
		if (err) {
			return self.emit('error', err);
		}
		gpio.direction('in', function (err) {
			if (err) {
				return self.emit('error', err);
			}
			gpio.edge(edge || 'both', function (err) {
				if (err) {
					return self.emit('error', err);
				}
				gpio.watch(function (err, watcher) {
					watcher.on('interrupt', function (value) {
						self.emit('pressed', value);
					});
					watcher.on('error', function (err) {
						self.emit('error', err);
					});
				});
			});
		});
	});

	return self;
};

utils.inherits(Button, EventEmitter);

module.exports = function (pin, edge) {
	return new Button(pin, edge);
};
