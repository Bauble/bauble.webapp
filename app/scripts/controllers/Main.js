'use strict';

angular.module('BaubleApp')
    .controller('MainCtrl', ['$scope', 'Auth', '$location', function ($scope, Auth, $location) {
        if(!Auth.isLoggedIn()) {
            $location.path("/login");
        } else {
            $location.path("/search");
        }
    }]);
