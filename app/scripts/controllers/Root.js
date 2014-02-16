'use strict';

angular.module('BaubleApp')
    .controller('RootCtrl', function ($scope, $location, $state, globals, User) {
        console.log('RootCtrl');
        $scope.alerts = globals.alerts;
        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };


        $scope.$on('$stateChangeSuccess', function() {
            // controls the user menu
            $scope.user = User.local();
        });
    });
