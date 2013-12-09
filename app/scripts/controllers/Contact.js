'use strict';

angular.module('BaubleApp')
    .controller('ContactCtrl', function ($scope, $http, globals) {
        $scope.data = {};
        $scope.success = false;
        $scope.error = false;
        $scope.submit = function() {
            $http.post(globals.apiRoot + "/contact", $scope.data)
                .success(function(data, status, headers, config) {
                    $scope.success = true;
                    $scope.error = false;

                })
                .error(function(data, status, headers, config) {
                    $scope.success = false;
                    $scope.error = true;
                });
        };
    });
