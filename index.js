/* CORE (done)
 * - wait for BLE notification
 * - detect cookie theft
 * - take a picture
 * - present the option for publication
 * - post to twitter
 *
 * EXTRA
 * - big red button (done)
 * - LEDs
 * */

var express = require('express');
var http = require('http');
var path = require('path');
var config = require('./lib/config');
var createPhotos = require('./lib/photos');
var createTweet = require('./lib/tweet');
var createAlarm = require('./lib/alarm');
var createSnap  = require('./lib/snap');
var createButton = require('./lib/button');


var app = express();
app.engine('jade', require('jade').__express);
app.set('views', config.web.views);
app.set('view engine', 'jade');
app.use(express.static(config.web.assets));

app.get('/', function (req, res) {
	res.render('index');
});

var server = http.createServer(app).listen(config.web.port, function () {
	console.log('HTTP server listening on port', config.web.port);
});

var io = require('socket.io').listen(server);

var photos = createPhotos();
var tweet = createTweet();
var alarm = createAlarm();
var snap = createSnap();
var button = createButton(114, 'rising');

alarm.on('theft', function (readings) {
	console.log('Thief!', readings);
	snap.take(function (err, photo) {
		if (err)
			console.log('[snap]', err);
		else
			io.sockets.emit('added', photo);
	});
});
alarm.on('error', function (err) {
	console.log('[alarm]', err);
});

button.on('pressed', function (value) {
	console.log('[button]', value == 1 ? 'abort' : '');
	if (value == 1) {
		io.sockets.emit('abort');
	}
});

io.sockets.on('connection', function (socket) {
	photos.list(function (err, all_photos) {
		if (err)
			console.log('[photos list]', err);
		// send all pictures
		io.sockets.emit('photos', all_photos);
	});
	photos.on('removed', function (old_photo) {
		io.sockets.emit('removed', old_photo);
	});
	// remote event
	socket.on('tweet', function (photo) {
		console.log('Tweeting', photo);
		tweet.post('cookies!', path.join(config.web.images, photo), function (err) {
			console.log('[Tweet]', err);
		});
		alarm.rearm();
	});
});
