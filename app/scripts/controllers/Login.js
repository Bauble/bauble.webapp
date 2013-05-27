'use strict';

angular.module('BaubleApp')
    .controller('LoginCtrl', function ($scope, Auth) {

        $scope.logIn = function() {
            console.log('logIn()');

            Auth.logIn($scope.username, $scope.password)
                .success(function(response) {
                    console.log( 'success' );
                })
                .error(function(response) {
                    console.log( 'error' );
                    console.log( 'arguments: ', arguments );
                    console.log( response );
                })
        };

    });
