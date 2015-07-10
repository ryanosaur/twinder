var express = require('express');
var Twitter = require("twitter");
var mongoose = require('mongoose');
var router = express.Router();

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/twinder');

var Loser = mongoose.model("Loser", {
  screen_name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

function twitterClient(params) {
  return new Twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: params.access_token_key,
    access_token_secret: params.access_token_secret
  });
};

Loser.on('index', function(err) {
  if (err) {
    console.error(err);
  }
});

router.post('/ignore', function(req, res, next){
  var newLoser = new Loser(req.body);
  newLoser.save(function(err, savedLoser) {
    if (err) {
      console.log(err);
      res.status(400).json({ error: "Validation Failed" });
    }
    console.log("savedLoser:", savedLoser);
    res.json(savedLoser);
  });
});

router.get('/ignore', function(req, res, next){
  Loser.find({}).exec(function(err, losers){
    if(err){
      console.log(err);
    }
    var ignored = losers.map(function(loser){
      return loser.screen_name;
    });
    res.json(ignored);
  });
});

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
