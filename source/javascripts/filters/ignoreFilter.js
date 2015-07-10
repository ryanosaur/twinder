
'use strict';

angular.module('sif')
.filter('ignoreFilter', function() {
  return function(users, ignored) {
    var filteredUsers = {};
    angular.forEach(users, function(userData, screenName) {
      if (ignored.indexOf(screenName) === -1) {
        filteredUsers[screenName] = userData;
      }
    });
    return filteredUsers;
  };
});
