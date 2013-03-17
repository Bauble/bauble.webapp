'use strict';

angular.module('BaubleApp', ['ui', 'ui.bootstrap'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/search', {
                templateUrl: 'views/search.html',
                controller: 'SearchCtrl'
            })

            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })

            .when('/admin', {
                templateUrl: 'views/admin.html',
                controller: 'AdminCtrl'
            })

            .when('/new/:resource', {
                templateUrl: 'views/new.html',
                controller: 'NewCtrl'
            })

            .when('/edit/:resource', {
                templateUrl: 'views/edit.html',
                controller: 'EditCtrl'
            })

            .when('/reporter', {
                templateUrl: 'views/report_design.html',
                controller: 'ReporterCtrl'
            })

            .otherwise({
                redirectTo: '/'
            });
  });
