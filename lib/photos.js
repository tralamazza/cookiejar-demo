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
		fs.readdir(config.web.images, function (err, files) {
			callback(err, err ? null : files.filter(function (file) {
				var ext = path.extname(file);
				return (ext === '.jpg') || (ext === '.jpeg');
			}));
		});
	};

	if (os.platform() !== 'win32') {
		var inotifywatch = require('inotifywatch');
		var watcher = inotifywatch(config.web.images);
		watcher.on('create', function (filename) {
			self.emit('added', filename);
		});
		watcher.on('delete', function (filename) {
			self.emit('removed', filename);
		});
	}

	return self;
};

utils.inherits(Photos, EventEmitter);

module.exports = function () {
	return new Photos();
};
