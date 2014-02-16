'use strict';

angular.module('BaubleApp', [
    'ngRoute',
    'ui.bootstrap',
    'ui.select2',
    'ngGrid',
    'ui.router'
])
    .config(function ($routeProvider, $stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('main', {
                abstract: true,
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .state('main.dashboard', {
                url: '/dashboard',
                templateUrl: 'views/dashboard.html',
                controller: 'DashboardCtrl'
            })
            .state('main.search', {
                url: '/search',
                templateUrl: 'views/search.html',
                controller: 'SearchCtrl'
            })

            .state('login', {
                url: '/login',
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })

            .state('logout', {
                url: '/logout',
                templateUrl: 'views/logout.html',
                controller: 'LogoutCtrl'
            })

            // .when('/newuser', {
            //     templateUrl: 'views/new_user.html'
            // })

            .state('signup', {
                url: '/signup',
                templateUrl: 'views/signup.html'
            })

            .state('main.organization-new', {
                url: '/organization/new',
                templateUrl: 'views/org-edit.html',
                controller: 'OrgEditCtrl'
            });

            // .when('/admin', {
            //     templateUrl: 'views/admin.html',
            //     controller: 'AdminCtrl'
            // })

            // .when('/new/:resource', {
            //     templateUrl: 'views/new.html',
            //     controller: 'NewCtrl'
            // })

            // .when('/edit/:resource', {
            //     templateUrl: 'views/edit.html',
            //     controller: 'EditCtrl'
            // })

            // .when('/reporter', {
            //     templateUrl: 'views/report_design.html',
            //     controller: 'ReporterCtrl'
            // })

            // .when('/docs', {
            //     templateUrl: 'views/docs.html'
            // })

            // .otherwise({
            //     redirectTo: '/'
            // });

        $urlRouterProvider.otherwise('/dashboard');
    });
