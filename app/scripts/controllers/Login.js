'use strict';

angular.module('BaubleApp')
    .controller('LoginCtrl', function ($scope, $routeParams, $location, Auth) {

        $scope.message = '';

        $scope.logIn = function() {
            Auth.logIn($scope.username, $scope.password)
                .success(function(response) {
                    // return to the page we came from else go directly to the
                    // search page
                    if($routeParams.redirect) {
                        $location.url($routeParams.redirect);
                    } else {
                        $location.url('/search');
                    }
                })
                .error(function(response) {
                    $scope.message = "Bad username or password."
                });
        };
    });
