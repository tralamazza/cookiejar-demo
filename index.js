
/* CORE
 * - wait for BLE notification
 * - detect cookie theft
 * - take a picture
 * - present the option for publication
 * - post to twitter
 *
 * EXTRA
 * - big red button
 * - LEDs
 * */

var notify_authorities = require('./lib/notify');
var theft_in_progress = require('./lib/theft');


theft_in_progress(function (err, photo) {
	if (err) {
		console.log(err);
	} else {
		notify_authorities('Thief detected!', photo, function (err) {
			console.log(err);
		});
	}
});

