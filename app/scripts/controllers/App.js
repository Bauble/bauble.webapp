'use strict';

angular.module('BaubleApp')
    .controller('AppCtrl', function ($scope, $location, Auth) {

        //$scope.shared = {};
        //$scope.shared.hideMainMenu = true;

        $scope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
            if(!Auth.isLoggedIn() && $location.path() !== '/login') {
                $location.url('/login?redirect=' + $location.url());
            }
        });

        $scope.logOut = function() {
            Auth.logOut();
        };
    });
