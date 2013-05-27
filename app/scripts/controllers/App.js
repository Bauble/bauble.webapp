'use strict';

angular.module('BaubleApp')
    .controller('AppCtrl', function ($scope, $route, $location, globals, Auth) {

        //$scope.shared = {};
        //$scope.shared.hideMainMenu = true;

        $scope.$on("$routeChangeStart", function(nextRoute, currentRoute) {
            console.log('$routeChangeStart');
            if(!Auth.isLoggedIn()) {
                $location.url("/login");
            }
            // console.log('$location.url(): ', $location.url());
            // console.log('arguments: ', arguments);
        });

        $scope.$on("$routeChangeSuccess", function(event, currentRoute, prevRoute) {
            // console.log('$routeChangeSuccess');
            // console.log('$location.url(): ', $location.url());
            // console.log('prevRoute: ', prevRoute);
        });


        $scope.logOut = function() {
            Auth.logOut();
        };
        // $scope.isLoggedIn = globals.isLoggedIn;
        // $scope.$watch('isLoggedIn()', function() {
        //     console.log('is logged in changed');
        // });
    });
