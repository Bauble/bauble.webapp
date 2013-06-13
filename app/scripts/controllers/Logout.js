'use strict';

angular.module('BaubleApp')
    .controller('LogoutCtrl', function ($scope, Auth) {
        Auth.logOut();
    });
