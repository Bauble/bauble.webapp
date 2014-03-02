'use strict';

angular.module('BaubleApp')
    .controller('SignupCtrl', ['$scope', '$location', 'User',
        function ($scope, $location, User) {
            $scope.message = null;

            $scope.save = function() {
                console.log('$scope.user: ', $scope.user);
                $scope.user.username = $scope.user.email;
                console.log('$scope.user: ', $scope.user);
                User.signup($scope.user)
                    .success(function(data, status, headers, config) {
                        console.log('data: ', data);
                        User.local(data);
                        $location.path("/");
                    })
                    .error(function(data, status, headers, config) {
                        $scope.message = "Error";
                    });
            };
        }]);
