'use strict';

angular.module('BaubleApp')
    .controller('AdminCtrl', function ($scope, Auth, Organization) {
        $scope.user = Auth.getUser();

        $scope.panes = [
            {
                title: 'Sysadmin',
                content: 'views/admin_sysadmin.html',
                show: $scope.user.is_sysadmin
            },
            {
                title: 'Organization',
                content: 'views/admin_org.html',
                show: $scope.user.is_org_admin
            },
            {
                title: 'My Account',
                content: 'views/admin_user.html',
                show: true
            }
        ];

        // $scope.user = Auth.getUser();
        // $scope.organization = null;

        // console.log('user: ', $scope.user);
        // if($scope.user.organization.ref) {
        //     Organization.setDepth(2);
        //     Organization.get($scope.organization)
        //     .success(function(data) {
        //         $scope.organization = data;
        //     })
        //     .error(function() {

        //     });
        // }
    });
