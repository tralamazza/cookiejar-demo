var express = require('express');
var logger = require('morgan');
var photos = require('./lib/photos');


var app = express();

app.get('/', function (req, res) {
	res.render('index');
});

app.engine('jade', require('jade').__express);

app.set('views', __dirname + '/views');
app.set('view engine', 'jade')
app.use(logger());
app.use(express.static(__dirname + '/assets'));

var io = require('socket.io').listen(app.listen(3456));

io.sockets.on('connection', function (socket) {
	photos.list(function (all_photos) {
		io.sockets.emit('photos', all_photos);
		photo.on('added', function (new_photo) {
			io.sockets.emit('added', new_photo);
		});
		photo.on('removed', function (old_photo) {
			io.sockets.emit('removed', old_photo);
		});
	});
});

