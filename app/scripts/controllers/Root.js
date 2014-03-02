'use strict';

angular.module('BaubleApp')
  .controller('RootCtrl', ['$scope', '$location', '$state', 'User',
    function ($scope, $location, $state, User) {
        console.log('RootCtrl');
        //$scope.alerts = globals.alerts;
        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };

        $scope.$on('$stateChangeSuccess', function() {
            // controls the user menu
            $scope.user = User.local();
        });

        $scope.$on('login', function() {
            $scope.user = User.local();
        });

        $scope.$on('logout', function() {
            $scope.user = User.local();
        });
    }]);
