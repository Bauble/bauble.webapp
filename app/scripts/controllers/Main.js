'use strict';

angular.module('BaubleApp')
  .controller('MainCtrl', ['$scope', '$location', 'User', 'Alert',
    function ($scope, $location, User, Alert) {

        $scope.user = User.local();
        $scope.Alert = Alert;

        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            // controls the user menu
            $scope.user = User.local();
            if(!$scope.user) {
                var path = _.contains(['main.forgot-password', 'main.reset-password'], toState.name) ?
                    toState.url : '/login';
                $location.path(path);
            } else if(!$scope.user.organization_id) {
                $location.path('/organization/new');
            }
        });
    }]);
