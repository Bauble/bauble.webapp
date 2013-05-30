'use strict';

angular.module('BaubleApp')
    .controller('AdminCtrl', function ($scope, Auth, Organization) {
        $scope.user = Auth.getUser();
        $scope.organization = null;

        console.log('user: ', $scope.user);
        if($scope.user.organization.ref) {
            Organization.setDepth(2);
            Organization.get($scope.organization)
            .success(function(data) {
                $scope.organization = data;
            })
            .error(function() {

            });
        }
    });
