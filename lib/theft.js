var noble = require('noble');
var snap = require('./snap');


var BFL = false;
var TheftDetector = function(callback) {
	noble.on('discover', function (per) {
		console.log(per.rssi, per.uuid);
		if (per.rssi >= -60) {
			if (!BFL) {
				BFL = true; // acquire
				console.log('theft in progress...');
				snap(function (err, photo) {
					callback(err, photo);
					BFL = false; // release
				});
			}
		}
	});

	console.log('Start scanning...');
	noble.startScanning([], true);
};

module.exports = TheftDetector;
