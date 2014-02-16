'use strict';

angular.module('BaubleApp')
    .controller('OrgEditCtrl', function ($scope, $location, User, Organization) {


        $scope.$watch('org', function(org) {
            console.log('org: ', org);
        });
        $scope.save = function(){
            console.log('$scope.org: ', $scope.org);
            Organization.save($scope.org)
                .success(function(data, status, headers, config) {
                    $scope.user = User.local();
                    $scope.user.organization_id = data.id;
                    User.local($scope.user);

                    // TODO: we should probably return to where we came from
                    $location.path('/');
                })
                .error(function(data, status, headers, config) {

                });
        };
    });
