'use strict';

angular.module('BaubleApp')
    .controller('AdminNewUserCtrl', function ($scope, dialog, Organization, User) {
        // the injected dialog is the dialog instance created by the $dialog
        // service

        // TODO: we should be able to access the list of organizations from the
        // sys admin page...this controller doesn't seem to inherit from the
        // sys admin page scope

        // get the list of organizations
        $scope.orgs = [];
        Organization.query()
            .success(function(data, status, headers, config) {
                $scope.orgs = data.results;
            })
            .error(function(data, status, headers, config) {
                $scope.orgs = [];
            });

        // TODO: make sure the two confirm password match

        // build the org name string for the select field
        $scope.orgName = function(org) {
            return org.short_name ? org.name +  '(' + org.short_name + ')' :
                org.name;
        };

        $scope.save = function(result) {
            console.log( 'save: ', result );

            // save the user
            console.log( $scope.user );

            User.save($scope.user)
                .success(function(data, status, result, config) {
                    dialog.close(result);
                })
                .error(function(data, status, result, config) {
                    // TODO: show an error message
                    console.log("Could not save the user.")
                    console.log(status);
                    console.log(result);
                })

        };
    });
