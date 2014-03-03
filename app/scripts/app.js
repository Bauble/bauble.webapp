'use strict';

angular.module('BaubleApp', [
    'ui.bootstrap',
    //'ngGrid',
    'ui.router'
])

  .config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

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
                controller: 'SearchCtrl',
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

            .state('main.resource-edit', {
                url: '/:resource/:id/edit',
                templateUrl: function($stateParams) {
                    return 'views/' + $stateParams.resource.toLowerCase() + "-edit.html";
                },
                controllerProvider: ['$stateParams', function($stateParams) {
                    var resource = $stateParams.resource;
                    resource = resource.slice(0,1).toUpperCase() + resource.slice(1, resource.length);
                    return resource + "EditCtrl";
                }]

            })

            .state('main.resource-add', {
                url: '/:resource/add',
                templateUrl: function($stateParams) {
                    return 'views/' + $stateParams.resource.toLowerCase()+ "-edit.html";
                },
                controllerProvider: ['$stateParams', function($stateParams) {
                    var resource = $stateParams.resource;
                    resource = resource.slice(0,1).toUpperCase() + resource.slice(1, resource.length);
                    return resource + "EditCtrl";
                }]
            })

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

        // .when('/reporter', {
        //     templateUrl: 'views/report_design.html',
        //     controller: 'ReporterCtrl'
        // })

        // .when('/docs', {
        //     templateUrl: 'views/docs.html'
        // })



        $urlRouterProvider.otherwise('/dashboard');
    }]);
