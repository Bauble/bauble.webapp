'use strict';

angular.module('BaubleApp')
    .controller('AdminSysadminCtrl', function ($scope, $dialog, User, Organization) {
        $scope.orgs = [];

        // TODO: right now there's not a way to query a resource and return the
        // admin data so we get the list of organizations and do an /admin lookup
        // on each one.....this is way slower

        // get the list of organizations
        Organization.query()
            .success(function(data, status, headers, config) {
                console.log(data)
                //$scope.orgs = data.results;
                angular.forEach(data.results, function(value, key) {
                    Organization.get_admin(value.ref)
                        .success(function(data, status, headers, config) {
                            console.log(data);
                            $scope.orgs.push(data)
                        });
                });
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
                },
                {
                    field: 'date_created',
                    displayName: 'Date Created'
                },
                {
                    field: 'date_approved',
                    displayName: 'Approved',
                    cellTemplate: '<a ng-show="row.entity" ng-click="approveOrg(row.entity)">Approve</a>'

                }
            ]
        };

        $scope.approveOrg = function(org){
            console.log('apprpve: ' + org);
        }

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
