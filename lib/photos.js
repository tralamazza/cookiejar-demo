var fs = require('fs');
var path = require('path');
var EventEmitter = require('events').EventEmitter;
var utils = require('util');


var Photos = function () {
	EventEmitter.call(this);
	var self = this;

	var PHOTOS_DIR = path.join(process.cwd(), 'public', 'images');

	self.list = function (callback) {
		fs.readDir(PHOTOS_DIR, function (err, files) {
			callback(err, err ? files.filter(function (file) {
				return path.extname(file) === '.jpg';
			}) : null);
		});
	};

	fs.watch(PHOTOS_DIR, function (ev, filename) {
		if (ev === 'rename') {
			fs.exists(filename, function (exists) {
				self.emit(exists ? 'added' : 'removed', filename);
			});
		}
	});
};

utils.inherits(Photos, EventEmitter);

module.exports = function () {
	return new Photos();
};
