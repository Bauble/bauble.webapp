'use strict';

angular.module('BaubleApp')
    .controller('MainCtrl', ['$scope', 'User', '$location',
        function ($scope, User, $location) {

            console.log('MainCtrl');
            $scope.user = User.local();

            if(!$scope.user) {
                $location.path('/login');
            } else if(!$scope.user.organization_id) {
                console.log('new org');
                $location.path('/organization/new');
            }

            // if(!$scope.user.organization) {
            //     $location.path($scope.user ? '/dashboard' : '/login');
            // }
            // $location.path($scope.user ? '/dashboard' : '/login');
            // if(!Auth.isLoggedIn()) {
            //     $location.path("/login");
            // } else {
            //     $location.path("/search");
            // }


        }]);
