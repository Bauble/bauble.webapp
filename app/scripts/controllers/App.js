'use strict';

angular.module('BaubleApp')
    .controller('AppCtrl', function ($scope, $route, $location) {

        //$scope.shared = {};
        //$scope.shared.hideMainMenu = true;

        $scope.$on("$routeChangeStart", function(nextRoute, currentRoute) {

            // console.log('$routeChangeStart');
            // console.log('$location.url(): ', $location.url());
            // console.log('arguments: ', arguments);
        });

        $scope.$on("$routeChangeSuccess", function(event, currentRoute, prevRoute) {
            // console.log('$routeChangeSuccess');
            // console.log('$location.url(): ', $location.url());
            // console.log('prevRoute: ', prevRoute);
        });
    });
