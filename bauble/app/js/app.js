'use strict';


// Declare app level module which depends on filters, and services
angular.module('BaubleApp', ['ui', 'BaubleApp.filters', 'BaubleApp.services',
                'BaubleApp.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider.when('/search', {
                templateUrl: 'partials/search.html',
                controller: SearchCtrl
			});

    $routeProvider.when('/login', {
                templateUrl: 'partials/login.html',
                controller: LoginCtrl
			});

    $routeProvider.when('/admin', {
                templateUrl: 'partials/admin.html',
                controller: AdminCtrl
			});

    $routeProvider.otherwise({redirectTo: '/search'});

    //$locationProvider.html5Mode(true);//.hashPrefix('!');

  }]);
