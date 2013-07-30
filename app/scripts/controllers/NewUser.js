'use strict';

angular.module('BaubleApp')
    .controller('NewUserCtrl', function ($scope, globals, Auth, Organization) {

        $scope.org = {}
        $scope.orgCreated = false;

        // TODO: if the user hasn't typed anything in the org or email
        // field for one second then start to validate

        $scope.submit = function() {
            // TODO: create the new user
            var org = {
                name: $scope.org.name,
                owners: [
                    {
                        username: $scope.email,
                        email: $scope.email,
                        password: $scope.password
                    }
                ]
            };

            Organization.save(org)
                .success(function(data, status, result, config) {
                    console.log("success");
                    $scope.orgCreated = true;
                    //dialog.close(result);
                })
                .error(function(data, status, result, config) {
                    console.log("Could not save the organization.");
                    if(status == 409) {
                        $scope.message = "The organization name or username is not unique."
                    } else {
                        $scope.message = "Could not create the organization."
                    }
                });
        };
    });
