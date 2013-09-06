'use strict';

angular.module('BaubleApp')
    .controller('AdminOrgCtrl', function ($scope, globals, Auth, Organization) {
        $scope.org = Auth.getUser().organization;
        Organization.details($scope.organization)
            .success(function(data, status, headers, config) {
                $scope.org = data;
            })
            .error(function(data, status, headers, config) {
                // do something
            })
    });
