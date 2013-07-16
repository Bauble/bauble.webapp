'use strict';

angular.module('BaubleApp')
    .controller('AdminSysadminCtrl', function ($scope, $dialog, User, Organization) {
        $scope.orgs = [];

        // get the list of organizations
        Organization.query()
            .success(function(data, status, headers, config) {
                $scope.orgs = data.results;
            })
            .error(function(data, status, headers, config) {
                $scope.orgs = [];
            });

        // setup the organization grid
        $scope.orgGridOptions = {
            data: 'orgs',
            columnDefs: [
                {
                    field: 'name',
                    displayName: 'Name'
                },
                {
                    field: 'short_name',
                    displayName: 'Short Name'
                },
                {
                    field: 'pg_schema',
                    displayName: 'Schema'
                }
            ]
        };

        // callback for adding a new organization
        $scope.newOrg = function() {
            var d = $dialog.dialog({
                templateUrl: 'views/admin_new_org.html',
                controller: 'AdminNewOrgCtrl'
            });
            d.open().then(function(result) {
                console.log( 'result: ', result );
                // TODO: save the organization
            });
        };

        $scope.users = [];
        User.query({depth: 1})
            .success(function(data, status, headers, config) {
                $scope.users = data.results;
                console.log( $scope.users );

            })
            .error(function() {
                $scope.users = [];
            });

        $scope.userGridOptions = {
            data: 'users',
            columnDefs: [
                {
                    field: 'username',
                    displayName: 'User name'
                },
                {
                    field: 'fullname',
                    displayName: 'Full name'
                },
                {
                    field: 'organization.name',
                    displayName: 'Organization'
                },
                {
                    field: 'is_org_admin',
                    displayName: 'Org admin'
                },
                {
                    field: 'is_org_owner',
                    displayName: 'Org owner'
                },
                {
                    field: 'is_sysadmin',
                    displayName: 'Sys admin'
                }
            ]
        };

        // callback for adding a new user
        $scope.newUser = function() {
            var d = $dialog.dialog({
                templateUrl: 'views/admin_new_user.html',
                controller: 'AdminNewUserCtrl'
            });
            d.open().then(function(result) {
                console.log( 'result: ', result );
                // TODO: save the organization
            });
        };
    });
