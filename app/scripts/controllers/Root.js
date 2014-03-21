'use strict';

angular.module('BaubleApp')
  .controller('RootCtrl', ['$scope', '$location', '$state', 'Alert', 'User',
    function ($scope, $location, $state, Alert, User) {

        $scope.$on('$stateChangeSuccess', function() {
            // controls the user menu
            $scope.user = User.local();
            Alert.clear();
        });

        $scope.$on('login', function() {
            $scope.user = User.local();
        });

        $scope.$on('logout', function() {
            $scope.user = User.local();
        });
    }]);
