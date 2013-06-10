'use strict';

angular.module('BaubleApp')
    .controller('AdminUserCtrl', function ($scope, globals, Auth, User) {
        
        $scope.setPassword = function() {
            if($scope.password1 !== $scope.password2) {
                globals.addAlert('Password do not match', 'error');
                return;
            }
            User.setPassword(Auth.getUser(), $scope.password1)
                .success(function() {
                    globals.addAlert('Password successfully set.', 'error');
                })
                .error(function() {
                    globals.addAlert('Password could not be set.', 'error');
                });
        };
    });
