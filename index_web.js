var express = require('express');
var logger = require('morgan');

var app = express();

app.get('/', function (req, res) {
	res.end('OK');
});

app.engine('jade', require('jade').__express);
app.use(logger());
app.use(express.static(__dirname + '/public'));

app.listen(3456);
