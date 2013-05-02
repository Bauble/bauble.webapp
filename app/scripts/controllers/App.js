'use strict';

angular.module('BaubleApp')
    .controller('AppCtrl', function ($scope, $route, $location, globals, $cookies) {

        //$scope.shared = {};
        //$scope.shared.hideMainMenu = true;

        $scope.$on("$routeChangeStart", function(nextRoute, currentRoute) {

            console.log('$routeChangeStart');
            //console.log('globals.isLoggedIn(): ', globals.isLoggedIn());
            //console.log('$cookies.test: ', $cookies.test);
            console.log('$.cookies("isLoggedIn"): ', $.cookie("isLoggedIn"));
            if(!globals.isLoggedIn()) {
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
            globals.logOut();
        };
        // $scope.isLoggedIn = globals.isLoggedIn;
        // $scope.$watch('isLoggedIn()', function() {
        //     console.log('is logged in changed');
        // });
    });
