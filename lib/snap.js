var cp = require('child_process');
var config = require('./config');
var fs = require('fs');
var path = require('path');


var Snapshot = function() {
	var self = this;

	self.take = function (callback) {
		var imgfullpath = process.cwd() + '/tmp/photo.jpeg';
		// default args
		var args = ['-o', imgfullpath].concat(config.snap.args || ['-d', '/dev/video0', '-W', '1280', '-H', '720']);
		// take a snapshot
		var child_grab = cp.spawn(config.snap.command || 'v4l2grab', args);
		child_grab.on('close', function (code) {
			var args = [imgfullpath, ].concat(config.convert.args);
			args.push(imgfullpath);
			// image resize
			var child_convert = cp.spawn(config.convert.command || 'convert', args || [imgfullpath, '-resize', '480x270', imgfullpath]);
			child_convert.on('close', function (code) {
				var destpath = path.join(config.web.images, Date.now() + '.jpg');
				// move image file
				fs.rename(imgfullpath, destpath, function (err) {
					callback(err, destpath);
				});
			});
		});
	};

	return self;
};

module.exports = function () {
	return new Snapshot();
};
