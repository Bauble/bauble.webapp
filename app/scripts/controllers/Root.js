'use strict';

angular.module('BaubleApp')
    .controller('RootCtrl', function ($scope, $location, globals, Auth) {
        $scope.alerts = globals.alerts;
        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };
    });
