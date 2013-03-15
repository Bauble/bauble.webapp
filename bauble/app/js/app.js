'use strict';

/*global SearchCtrl LoginCtrl AdminCtrl ReporterCtrl*/ //jshint flags

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

    $routeProvider.when('/reporter', {
                templateUrl: 'partials/report_design.html',
                controller: ReporterCtrl
            });

    $routeProvider.otherwise({redirectTo: '/search'});

    //$locationProvider.html5Mode(true);//.hashPrefix('!');

  }]);
