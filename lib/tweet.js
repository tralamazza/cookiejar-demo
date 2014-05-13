var config = require('./config');
var Twitter = require('node-twitter');


var Tweet = function(text, media, callback) {
	var self = this;

	var client = new Twitter.RestClient(
		config.twitter.api_key,
		config.twitter.api_secret,
		config.twitter.access_token,
		config.twitter.access_token_secret
	);

	self.post = function (text, media, callback) {
		if (typeof media === 'function') {
			callback = media;
			client.statusedUpdate({ 'status': text }, callback);
		} else {
			var updt = { 'status': text, 'media[]': media };
			client.statusesUpdateWithMedia(updt, callback);
		}
	};

	return self;
};

module.exports = function () {
	return new Tweet();
};
