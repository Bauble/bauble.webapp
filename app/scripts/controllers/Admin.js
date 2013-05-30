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
    });
