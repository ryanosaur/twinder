var express = require('express');
var Twitter = require("twitter");
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var client = new Twitter({
  consumer_key: '',
  consumer_secret: '',
  access_token_key: '',
  access_token_secret: ''
});

router.post('/tweet', function(req, res, next) {
  client.post('statuses/update', { status: req.body.tweet }, function(error, tweets, response){
    if (!error) {
      res.json(tweets);
    }
  });
});

router.post('/search', function(req, res, next) {
  var words = req.body.words.split(" ");

  client.get('search/tweets', { q: words.join(" OR "), count: 100 }, function(error, tweets, response){
    if (!error) {
      var stats = {}, tweetText;

      tweets.statuses.forEach(function(tweet) {
        tweetText = tweet.text.toLowerCase();
        words.forEach(function(word) {
          stats[word] = stats[word] || 0;

          if (tweetText.match(word.toLowerCase())) {
            stats[word]++
          }
        });
      });

      res.json(stats);
    }
  });

});

module.exports = router;
