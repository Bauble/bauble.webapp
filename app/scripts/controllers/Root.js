'use strict';

angular.module('BaubleApp')
    .controller('RootCtrl', function ($scope, $location, globals, Auth) {

        //$scope.shared = {};
        //$scope.shared.hideMainMenu = true;
        $scope.alerts = globals.alerts;
        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };

        $scope.isLoggedIn = Auth.isLoggedIn();
        $scope.$watch(function() {
            return Auth.isLoggedIn();
        }, function() {
            $scope.isLoggedIn = Auth.isLoggedIn();
        });

        var routesWithoutLogin = ["/login", "/logout", "/", "/newuser", "/docs", "/faq",
                                 "/about", "/contact", "/privacy", "/curious", "/classic"];
        $scope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
            if(!Auth.isLoggedIn() &&
               routesWithoutLogin.indexOf($location.path()) === -1) {
                $location.url('/login?redirect=' + $location.url());
            }
        });
    });
