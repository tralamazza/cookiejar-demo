var express = require('express');
var logger = require('morgan');

var app = express();

app.get('/', function (req, res) {
	res.render('index');
});

app.engine('jade', require('jade').__express);

app.set('views', __dirname + '/views');
app.set('view engine', 'jade')
app.use(logger());
app.use(express.static(__dirname + '/assets'));

app.listen(3456);
