'use strict';

angular.module('BaubleApp')
    .controller('NewUserCtrl', function ($scope, $http, globals, Organization) {

        $scope.org = {}

        $scope.$watch('accountType', function() {
            console.log('$scope.accountType: ', $scope.accountType);
            if($scope.accountType === 'org') {
                var url = globals.apiRoot + "/organizations";
                console.log('url: ', url);
                $http.get(url)
                    .success(function(response) {
                        $scope.organization = response.data;
                    })
                    .error(function(response) {
                        console.log("ERROR: Could not get list of organizations: ", response);
                        // TODO: add an alert telling the user that we couldn't get
                        // the list of organizations
                    });
            }
        });

        $scope.submit = function() {
            // TODO: create the new user
            var org = {
                name: $scope.name,
                owners: [
                    {
                        username: $scope.email,
                        email: $scope.username,
                        password: $scope.password
                    }
                ]
            }

            Organization.save(org)
                .success(function(data, status, result, config) {
                    console.log("success");
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
