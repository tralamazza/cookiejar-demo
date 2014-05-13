var fs = require('fs');
var path = require('path');
var EventEmitter = require('events').EventEmitter;
var utils = require('util');
var os = require('os');
var config = require('./config');


var Photos = function () {
	EventEmitter.call(this);
	var self = this;

	self.list = function (callback) {
		console.log(config.web.images)
		fs.readdir(config.web.images, function (err, files) {
			callback(err, err ? null : files.filter(function (file) {
				return path.extname(file) === '.jpg';
			}));
		});
	};

	fs.watch(config.web.images, function (ev, filename) {
		if (ev === 'rename') {
			if (os.platform() === 'win32') {
				// on windows filename is kaputz on removals
				if (filename) {
					self.emit('added', filename);
				}
			} else {
				fs.exists(filename, function (exists) {
					self.emit(exists ? 'added' : 'removed', filename);
				});
			}
		}
	});
};

utils.inherits(Photos, EventEmitter);

module.exports = function () {
	return new Photos();
};
