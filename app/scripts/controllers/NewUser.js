'use strict';

angular.module('BaubleApp')
    .controller('NewUserCtrl', function ($scope, globals, Auth, Organization) {

        $scope.org = {}

        // TODO: if the user hasn't typed anything in the org or email
        // field for one second then start to validate

        $scope.submit = function() {
            // TODO: create the new user
            var org = {
                name: $scope.name,
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
                    Auth.logIn($scope.email, $scope.password)
                        .success(function() {
                            $location.url('/search');
                        })
                        .error(function() {
                            // TODO: do something
                        })

                    //dialog.close(result);
                })
                .error(function(data, status, result, config) {
                    // TODO: show an error message
                    console.log("Could not save the user.");
                    console.log(status);
                    console.log(result);
                });
        };
    });
