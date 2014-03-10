'use strict';

angular.module('BaubleApp')
  .controller('SettingsCtrl', ['$scope', 'User',
    function ($scope, User) {
        $scope.user = User.local();
    }]);
