var express = require('express');
var Twitter = require("twitter");
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

router.post('/tweet', function(req, res, next) {
  client.post('statuses/update', { status: req.body.tweet }, function(error, tweets, response){
    if (!error) {
      res.json(tweets);
    }
  });
});

router.post('/search', function(req, res, next) {
  var words = req.body.words.toLowerCase().split(" ");

  client.get('search/tweets', { q: words.join(" OR "), count: 100 }, function(error, tweets, response){
    if (error) {
      console.error(error);
      res.status(500);
    }

    var stats = {}, oneTweetWords, lowerCaseWord, users = {};

    tweets.statuses.forEach(function(tweet) {
      oneTweetWords = tweet.text.toLowerCase().split(" ");
      oneTweetWords.forEach(function(word) {
        lowerCaseWord = word.toLowerCase();
        if (words.indexOf(lowerCaseWord) >= 0) {
          stats[word] = stats[word] || 0;
          stats[word]++;
        }
      });
    });

    res.json({ stats: stats, users: users });
  });

});

module.exports = router;
