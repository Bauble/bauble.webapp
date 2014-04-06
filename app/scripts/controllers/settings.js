'use strict';

angular.module('BaubleApp')
  .controller('SettingsCtrl', ['$scope', 'User',
    function ($scope, User) {
        $scope.user = User.local();

        $scope.model = {
            password1: '',
            password2: '',
            changedPasswordSuccess: null
        };


        $scope.changePassword = function(password) {
            // send request with password from form instead of
            // stored auth token
            $scope.user.save({id: $scope.user.id, password: password})
                .success(function(data, status, headers, config) {
                    $scope.changePasswordSuccess = true;
                    $scope.model.password1 = '';
                    $scope.model.password2 = '';
                })
                .error(function(data, status, headers, config) {
                    $scope.changePasswordSuccess = false;
                });

        };
    }]);
