'use strict';

angular.module('BaubleApp')
    .controller('LoginCtrl', function ($scope, $routeParams, $location, Auth) {

        $scope.message = '';

        $scope.logIn = function() {
            Auth.logIn($scope.username, $scope.password)
                .success(function(response) {
                    // return to the page we came from else go directly to the
                    // search page
                    if($routeParams.redirect) {
                        $location.url($routeParams.redirect);
                    } else {
                        $location.url('/search');
                    }
                })
                .error(function(data, status, headers, config) {
                    switch(status) {
                        case 480:
                            console.log("not approved");
                            $scope.message = "This account has not been approved.";
                            break;
                        case 481:
                            $scope.message = "The organization this user account "+
                                "belongs to has been suspended";
                            break;
                        case 482:
                            $scope.message = "This user account has been suspended";
                            break;
                        default:
                            $scope.message = "Bad username or password."
                    }
                });
        };
    });
