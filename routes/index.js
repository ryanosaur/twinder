var express = require('express');
var Twitter = require("twitter");
var router = express.Router();

function twitterClient(params) {
  return new Twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: params.access_token_key,
    access_token_secret: params.access_token_secret
  });
};

router.post('/tweet', function(req, res, next) {
  var client = twitterClient(req.body);

  client.post('statuses/update', { status: req.body.tweet }, function(error, tweets, response){
    if (error) {
      console.error(error);
      res.status(500);
      return;
    }

    res.json(tweets);
  });
});

router.post('/search', function(req, res, next) {
  var client = twitterClient(req.body);
  var words = req.body.words.toLowerCase().split(" ");

  client.get('search/tweets', { q: words.join(" OR "), count: 100 }, function(error, tweets, response){
    if (error) {
      console.error(error);
      res.status(500);
      return;
    }

    var stats = {}, oneTweetWords, lowerCaseWord, users = {};

    tweets.statuses.forEach(function(tweet) {
      oneTweetWords = tweet.text.toLowerCase().split(" ");
      oneTweetWords.forEach(function(word) {
        lowerCaseWord = word.toLowerCase();
        if (words.indexOf(lowerCaseWord) >= 0) {
          stats[word] = stats[word] || 0;
          stats[word]++;
          var ratio = tweet.user.friends_count/tweet.user.followers_count;
          tweet.user.ratio = ratio > 1 ? 1.0/ratio : ratio;
          users[tweet.user.screen_name] = tweet.user;
        }
      });
    });

    res.json({ stats: stats, users: users });
  });

});

router.post('/follow', function(req, res, next) {
  var client = twitterClient(req.body);

  client.post('friendships/create', { screen_name: req.body.screen_name }, function(error, user, response){
    if (error) {
      console.error(error);
      res.status(500);
      return;
    }

    res.json(user);
  });

});

module.exports = router;
