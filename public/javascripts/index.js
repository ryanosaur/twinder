'use strict';

var app = angular.module('sif', ['firebase', 'ui.router']);

app.filter('friendsFilter', function() {
  return function(users, showFriends) {
    if (showFriends) {
      return users;
    }

    var filteredUsers = {};
    angular.forEach(users, function(userData, screenName) {
      if (!userData.following) {
        filteredUsers[screenName] = userData;
      }
    });
    return filteredUsers;
  };
});

app.controller("mainCtrl", function($scope, twitterUser) {
  $scope.tags = [];
  $scope.tweet = "";

  $scope.btnStyle = function(ratio) {
    var greenScale = Math.floor(125 * ratio);
    return { 'background-color': 'rgb(0,' + greenScale + ',0)' };
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

'use strict';

angular.module('sif')
.service('twitterUser', function(urls, $http, FBService) {

  var withTokens = function(obj) {
    obj.access_token_key = FBService.currentUser.accessToken;
    obj.access_token_secret = FBService.currentUser.accessTokenSecret;
    return obj;
  }

  this.search = function(words) {
    var data = withTokens({ words: words });
    return $http.post(urls.apiUrl + "/search", data);
  };

  this.sendTweet = function(tweet) {
    var data = withTokens({ tweet: tweet });
    return $http.post(urls.apiUrl + "/tweet", data);
  };

  this.follow = function(screenName) {
    var data = withTokens({ screen_name: screenName });
    return $http.post(urls.apiUrl + "/follow", data);
  };

});

'use strict';

angular.module('sif')
.config(function($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise('/');
    
  $stateProvider
  .state('home', {url: '/', templateUrl: '/views/home/home.html'})
  .state('user', {url: '', templateUrl: '/views/users/user.html', abstract: true})
  .state('user.register', {url: '/register', templateUrl: '/views/users/users.html', controller: 'UsersCtrl'})
  .state('user.login', {url: '/login', templateUrl: '/views/users/users.html', controller: 'UsersCtrl'});
});

'use strict';

angular.module('sif')
.constant('urls',{
  'apiUrl': 'http://localhost:8000',
  'firebaseUrl': 'https://twittertool.firebaseio.com'
});

'use strict';

angular.module('sif')
.run(function(){
  console.log('Sif Online');
});

'use strict';

angular.module('sif')
.service('FBService', function($window, $firebaseAuth, urls){
  var fb = this;

  this.db = new Firebase(urls.firebaseUrl);

  this.db.onAuth(function(authData) {
    if (authData) {
      fb.currentUser = authData.twitter;
      console.log("Logged in: ", authData);
    }
  });

  this.twitterLogout = function() {
    fb.db.unauth();
  };

  this.twitterLogin = function() {
    fb.db.authWithOAuthRedirect("twitter", function(error) {
      if (error) {
        console.log("Login Failed!", error);
      }
    });
  };

});

'use strict';

angular.module('sif')
.factory('User', function(){
  return;
});

'use strict';

angular.module('sif')
.controller('NavCtrl', function($scope, FBService){
  $scope.login = FBService.twitterLogin;
  $scope.logout = FBService.twitterLogout;

  $scope.currentUser = FBService.currentUser;
});

'use strict';

angular.module('sif')
.controller('UsersCtrl', function($scope, $state){
  console.log('user ctrl online');
  
  $scope.name = $state.current.name.split('.')[1];
  
  $scope.submit = function(user){
    console.log(user);
  };
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIiwidHdpdHRlclVzZXIuanMiLCJjb25maWcvY29uZmlnLmpzIiwiY29uZmlnL2NvbnN0YW50cy5qcyIsImNvbmZpZy9ydW4uanMiLCJtb2RlbHMvZmJzZXJ2aWNlLmpzIiwibW9kZWxzL3VzZXIuanMiLCJ2aWV3cy9uYXYvbmF2LmpzIiwidmlld3MvdXNlcnMvdXNlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdzaWYnLCBbJ2ZpcmViYXNlJywgJ3VpLnJvdXRlciddKTtcblxuYXBwLmZpbHRlcignZnJpZW5kc0ZpbHRlcicsIGZ1bmN0aW9uKCkge1xuICByZXR1cm4gZnVuY3Rpb24odXNlcnMsIHNob3dGcmllbmRzKSB7XG4gICAgaWYgKHNob3dGcmllbmRzKSB7XG4gICAgICByZXR1cm4gdXNlcnM7XG4gICAgfVxuXG4gICAgdmFyIGZpbHRlcmVkVXNlcnMgPSB7fTtcbiAgICBhbmd1bGFyLmZvckVhY2godXNlcnMsIGZ1bmN0aW9uKHVzZXJEYXRhLCBzY3JlZW5OYW1lKSB7XG4gICAgICBpZiAoIXVzZXJEYXRhLmZvbGxvd2luZykge1xuICAgICAgICBmaWx0ZXJlZFVzZXJzW3NjcmVlbk5hbWVdID0gdXNlckRhdGE7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGZpbHRlcmVkVXNlcnM7XG4gIH07XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoXCJtYWluQ3RybFwiLCBmdW5jdGlvbigkc2NvcGUsIHR3aXR0ZXJVc2VyKSB7XG4gICRzY29wZS50YWdzID0gW107XG4gICRzY29wZS50d2VldCA9IFwiXCI7XG5cbiAgJHNjb3BlLmJ0blN0eWxlID0gZnVuY3Rpb24ocmF0aW8pIHtcbiAgICB2YXIgZ3JlZW5TY2FsZSA9IE1hdGguZmxvb3IoMTI1ICogcmF0aW8pO1xuICAgIHJldHVybiB7ICdiYWNrZ3JvdW5kLWNvbG9yJzogJ3JnYigwLCcgKyBncmVlblNjYWxlICsgJywwKScgfTtcbiAgfTtcblxuICAkc2NvcGUuZm9sbG93ID0gZnVuY3Rpb24oc2NyZWVuTmFtZSkge1xuICAgIHR3aXR0ZXJVc2VyLmZvbGxvdyhzY3JlZW5OYW1lKVxuICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgJHNjb3BlLmRhdGEudXNlcnNbc2NyZWVuTmFtZV0uZm9sbG93aW5nID0gdHJ1ZTtcbiAgICB9KVxuICAgIC5jYXRjaChmdW5jdGlvbihlcnJvcikge1xuICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gICRzY29wZS5zZWFyY2ggPSBmdW5jdGlvbigpIHtcbiAgICB0d2l0dGVyVXNlci5zZWFyY2goJHNjb3BlLndvcmRzKVxuICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgJHNjb3BlLmRhdGEgPSBkYXRhO1xuICAgIH0pXG4gICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgJHNjb3BlLnNlbmRUd2VldCA9IGZ1bmN0aW9uKCkge1xuICAgIHR3aXR0ZXJVc2VyLnNlbmRUd2VldCgkc2NvcGUudHdlZXQpXG4gICAgLnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcCkge1xuICAgICAgJHNjb3BlLnR3ZWV0ID0gXCJcIjtcbiAgICB9KVxuICAgIC5jYXRjaChmdW5jdGlvbihlcnJvcikge1xuICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgIH0pO1xuICB9O1xuXG4gICRzY29wZS5pbmNsdWRlSW5Ud2VldCA9IGZ1bmN0aW9uKHRhZykge1xuICAgICRzY29wZS50d2VldCA9ICRzY29wZS50d2VldCArIFwiIFwiICsgdGFnO1xuICB9O1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmFuZ3VsYXIubW9kdWxlKCdzaWYnKVxuLnNlcnZpY2UoJ3R3aXR0ZXJVc2VyJywgZnVuY3Rpb24odXJscywgJGh0dHAsIEZCU2VydmljZSkge1xuXG4gIHZhciB3aXRoVG9rZW5zID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgb2JqLmFjY2Vzc190b2tlbl9rZXkgPSBGQlNlcnZpY2UuY3VycmVudFVzZXIuYWNjZXNzVG9rZW47XG4gICAgb2JqLmFjY2Vzc190b2tlbl9zZWNyZXQgPSBGQlNlcnZpY2UuY3VycmVudFVzZXIuYWNjZXNzVG9rZW5TZWNyZXQ7XG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIHRoaXMuc2VhcmNoID0gZnVuY3Rpb24od29yZHMpIHtcbiAgICB2YXIgZGF0YSA9IHdpdGhUb2tlbnMoeyB3b3Jkczogd29yZHMgfSk7XG4gICAgcmV0dXJuICRodHRwLnBvc3QodXJscy5hcGlVcmwgKyBcIi9zZWFyY2hcIiwgZGF0YSk7XG4gIH07XG5cbiAgdGhpcy5zZW5kVHdlZXQgPSBmdW5jdGlvbih0d2VldCkge1xuICAgIHZhciBkYXRhID0gd2l0aFRva2Vucyh7IHR3ZWV0OiB0d2VldCB9KTtcbiAgICByZXR1cm4gJGh0dHAucG9zdCh1cmxzLmFwaVVybCArIFwiL3R3ZWV0XCIsIGRhdGEpO1xuICB9O1xuXG4gIHRoaXMuZm9sbG93ID0gZnVuY3Rpb24oc2NyZWVuTmFtZSkge1xuICAgIHZhciBkYXRhID0gd2l0aFRva2Vucyh7IHNjcmVlbl9uYW1lOiBzY3JlZW5OYW1lIH0pO1xuICAgIHJldHVybiAkaHR0cC5wb3N0KHVybHMuYXBpVXJsICsgXCIvZm9sbG93XCIsIGRhdGEpO1xuICB9O1xuXG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxuYW5ndWxhci5tb2R1bGUoJ3NpZicpXG4uY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpe1xuICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvJyk7XG4gICAgXG4gICRzdGF0ZVByb3ZpZGVyXG4gIC5zdGF0ZSgnaG9tZScsIHt1cmw6ICcvJywgdGVtcGxhdGVVcmw6ICcvdmlld3MvaG9tZS9ob21lLmh0bWwnfSlcbiAgLnN0YXRlKCd1c2VyJywge3VybDogJycsIHRlbXBsYXRlVXJsOiAnL3ZpZXdzL3VzZXJzL3VzZXIuaHRtbCcsIGFic3RyYWN0OiB0cnVlfSlcbiAgLnN0YXRlKCd1c2VyLnJlZ2lzdGVyJywge3VybDogJy9yZWdpc3RlcicsIHRlbXBsYXRlVXJsOiAnL3ZpZXdzL3VzZXJzL3VzZXJzLmh0bWwnLCBjb250cm9sbGVyOiAnVXNlcnNDdHJsJ30pXG4gIC5zdGF0ZSgndXNlci5sb2dpbicsIHt1cmw6ICcvbG9naW4nLCB0ZW1wbGF0ZVVybDogJy92aWV3cy91c2Vycy91c2Vycy5odG1sJywgY29udHJvbGxlcjogJ1VzZXJzQ3RybCd9KTtcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5hbmd1bGFyLm1vZHVsZSgnc2lmJylcbi5jb25zdGFudCgndXJscycse1xuICAnYXBpVXJsJzogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODAwMCcsXG4gICdmaXJlYmFzZVVybCc6ICdodHRwczovL3R3aXR0ZXJ0b29sLmZpcmViYXNlaW8uY29tJ1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmFuZ3VsYXIubW9kdWxlKCdzaWYnKVxuLnJ1bihmdW5jdGlvbigpe1xuICBjb25zb2xlLmxvZygnU2lmIE9ubGluZScpO1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmFuZ3VsYXIubW9kdWxlKCdzaWYnKVxuLnNlcnZpY2UoJ0ZCU2VydmljZScsIGZ1bmN0aW9uKCR3aW5kb3csICRmaXJlYmFzZUF1dGgsIHVybHMpe1xuICB2YXIgZmIgPSB0aGlzO1xuXG4gIHRoaXMuZGIgPSBuZXcgRmlyZWJhc2UodXJscy5maXJlYmFzZVVybCk7XG5cbiAgdGhpcy5kYi5vbkF1dGgoZnVuY3Rpb24oYXV0aERhdGEpIHtcbiAgICBpZiAoYXV0aERhdGEpIHtcbiAgICAgIGZiLmN1cnJlbnRVc2VyID0gYXV0aERhdGEudHdpdHRlcjtcbiAgICAgIGNvbnNvbGUubG9nKFwiTG9nZ2VkIGluOiBcIiwgYXV0aERhdGEpO1xuICAgIH1cbiAgfSk7XG5cbiAgdGhpcy50d2l0dGVyTG9nb3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgZmIuZGIudW5hdXRoKCk7XG4gIH07XG5cbiAgdGhpcy50d2l0dGVyTG9naW4gPSBmdW5jdGlvbigpIHtcbiAgICBmYi5kYi5hdXRoV2l0aE9BdXRoUmVkaXJlY3QoXCJ0d2l0dGVyXCIsIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJMb2dpbiBGYWlsZWQhXCIsIGVycm9yKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmFuZ3VsYXIubW9kdWxlKCdzaWYnKVxuLmZhY3RvcnkoJ1VzZXInLCBmdW5jdGlvbigpe1xuICByZXR1cm47XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxuYW5ndWxhci5tb2R1bGUoJ3NpZicpXG4uY29udHJvbGxlcignTmF2Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRkJTZXJ2aWNlKXtcbiAgJHNjb3BlLmxvZ2luID0gRkJTZXJ2aWNlLnR3aXR0ZXJMb2dpbjtcbiAgJHNjb3BlLmxvZ291dCA9IEZCU2VydmljZS50d2l0dGVyTG9nb3V0O1xuXG4gICRzY29wZS5jdXJyZW50VXNlciA9IEZCU2VydmljZS5jdXJyZW50VXNlcjtcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5hbmd1bGFyLm1vZHVsZSgnc2lmJylcbi5jb250cm9sbGVyKCdVc2Vyc0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsICRzdGF0ZSl7XG4gIGNvbnNvbGUubG9nKCd1c2VyIGN0cmwgb25saW5lJyk7XG4gIFxuICAkc2NvcGUubmFtZSA9ICRzdGF0ZS5jdXJyZW50Lm5hbWUuc3BsaXQoJy4nKVsxXTtcbiAgXG4gICRzY29wZS5zdWJtaXQgPSBmdW5jdGlvbih1c2VyKXtcbiAgICBjb25zb2xlLmxvZyh1c2VyKTtcbiAgfTtcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9