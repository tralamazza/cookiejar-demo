var config = require('./config');
var Twitter = require('node-twitter');


var client = new Twitter.RestClient(
	config.twitter.api_key,
	config.twitter.api_secret,
	config.twitter.access_token,
	config.twitter.access_token_secret
);

var Tweet = function(text, media, callback) {
	var updt = {
		'status': text,
		'media[]': media
	};
	client.statusesUpdateWithMedia(updt, function (err, result) {
		callback(err ? err : null, result);
	});
};

module.exports = Tweet;
