'use strict';

angular.module('BaubleApp')
    .controller('LoginCtrl', function ($scope, $routeParams, $location, Auth) {

        $scope.logIn = function() {
            Auth.logIn($scope.username, $scope.password)
                .success(function(response) {
                    // return to the page we came from
                    if($routeParams.redirect) {
                        $location.url($routeParams.redirect);
                    }
                })
                .error(function(response) {
                    console.log( 'error' );
                    console.log( 'arguments: ', arguments );
                    console.log( response );
                });
        };
    });
