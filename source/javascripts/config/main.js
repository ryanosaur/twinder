'use strict';

angular.module('sif')
.config(function($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise('/');

  $stateProvider
  .state('home', {url: '/', templateUrl: '/templates/home/home.html'})
});

'use strict';

angular.module('sif')
.constant('urls',{
  'apiUrl': ''
});
