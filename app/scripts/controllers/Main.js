'use strict';

angular.module('BaubleApp')
  .controller('MainCtrl', ['$scope', '$location', 'User', 'Alert',
    function ($scope, $location, User, Alert) {

        $scope.user = User.local();
        $scope.Alert = Alert;

        // if(!$scope.user) {
        //     $location.path('/login');
        // } else if(!$scope.user.organization_id) {
        //     console.log('new org');
        //     $location.path('/organization/new');
        // }

        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            // controls the user menu
            $scope.user = User.local();
            if(!$scope.user) {
                $location.path('/login');
            } else if(!$scope.user.organization_id) {
                $location.path('/organization/new');
            }
        });

        // if(!$scope.user.organization) {
        //     $location.path($scope.user ? '/dashboard' : '/login');
        // }
        // $location.path($scope.user ? '/dashboard' : '/login');
        // if(!Auth.isLoggedIn()) {
        //     $location.path("/login");
        // } else {
        //     $location.path("/search");
        // }


    }]);
