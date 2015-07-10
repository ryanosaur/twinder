'use strict';

angular.module('sif')
.controller("mainCtrl", function($scope, twitterUser) {
  $scope.tags = [];
  $scope.ignored = [];
  $scope.tweet = "";

  twitterUser.getIgnoreList()
  .success(function(ignored) {
    console.log(ignored);
    $scope.ignored = ignored;
  })
  .catch(function(error) {
    console.log(error);
  });

  $scope.btnStyle = function(ratio) {
    var greenScale = Math.floor(125 * ratio);
    return {
      'background-color': 'rgb(0,' + greenScale + ',0)'
    };
  };

  $scope.follow = function(screenName) {
    twitterUser.follow(screenName)
    .success(function(data) {
      console.log(data);
      $scope.data.users[screenName].following = true;
    })
    .catch(function(error) {
      console.log(error);
    });

    return false;
  };

  $scope.ignore = function(screenName) {
    twitterUser.ignore(screenName)
    .success(function(data) {
      $scope.ignored.push(data.screen_name);
    })
    .catch(function(error) {
      console.log(error);
    });

    return false;
  };

  $scope.search = function() {
    twitterUser.search($scope.words)
    .success(function(data) {
      console.log(data);
      $scope.data = data;
    })
    .catch(function(error) {
      console.log(error);
    });

    return false;
  };

  $scope.sendTweet = function() {
    twitterUser.sendTweet($scope.tweet)
    .success(function(resp) {
      $scope.tweet = "";
    })
    .catch(function(error) {
      console.log(error);
    });
  };

  $scope.includeInTweet = function(tag) {
    $scope.tweet = $scope.tweet + " " + tag;
  };
});
