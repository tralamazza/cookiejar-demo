var express = require('express');
var logger = require('morgan');
var http = require('http');
var photos = require('./lib/photos')();


var app = express();
app.engine('jade', require('jade').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(logger());
app.use(express.static(__dirname + '/assets'));

app.get('/', function (req, res) {
	res.render('index');
});

var server = http.createServer(app).listen(3456, function(){
	console.log('Express server listening on port ' + 3456);
});

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
	photos.list(function (err, all_photos) {
		// send all pictures
		io.sockets.emit('photos', all_photos);
		// local events
		photos.on('added', function (new_photo) {
			io.sockets.emit('added', new_photo);
		});
		photos.on('removed', function (old_photo) {
			io.sockets.emit('removed', old_photo);
		});
		// remote event
		socket.on('tweet', function (data) {
			console.log('tweeting', data);
		});
	});
});
