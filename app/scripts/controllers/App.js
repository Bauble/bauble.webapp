'use strict';

angular.module('BaubleApp')
    .controller('AppCtrl', function ($scope, $location, globals, Auth) {

        //$scope.shared = {};
        //$scope.shared.hideMainMenu = true;
        $scope.alerts = globals.alerts;
        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };

        var routesWithoutLogin = ["/login", "/logout"]
        $scope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
            if(!Auth.isLoggedIn() && 
               routesWithoutLogin.indexOf($location.path()) == -1) {
                $location.url('/login?redirect=' + $location.url());
            }
        });
    });
