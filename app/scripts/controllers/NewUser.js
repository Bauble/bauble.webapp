'use strict';

angular.module('BaubleApp')
    .controller('NewUserCtrl', function ($scope, $http, globals) {

        $scope.step = 1;
        $scope.nextStep = function() {
            $scope.step += 1;
        };

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
        };
    });
