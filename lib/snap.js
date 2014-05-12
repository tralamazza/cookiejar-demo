var cp = require('child_process');
var config = require('./config');
var fs = require('fs');
var path = require('path');


var Snapshot = function(callback) {
	var imgfullpath = process.cwd() + '/tmp/photo.jpg';
	// default command
	var cmd = config.snap.command || 'v4l2grab';
	// default args
	var args = ['-o', imgfullpath].concat(config.snap.args || ['-d', '/dev/video0', '-W', '1280', '-H', '720']);
	// take a snapshot
	var child = cp.spawn(cmd, args);
	// once it finished
	child.on('close', function (code) {
		setTimeout(function () {
			var destpath = path.join(config.web.images, Date.now() + '.jpg');
			// move image file
			fs.rename(imgfullpath, destpath, function (err) {
				callback(err ? err : null, destpath);
			});
		}, 100);
	});
};

module.exports = Snapshot;
