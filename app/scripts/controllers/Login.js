'use strict';

angular.module('BaubleApp')
    .controller('LoginCtrl', function ($scope, $cookies) {

        $scope.logIn = function() {
            console.log('logIn()');
            //console.log('$cookies: ', $cookies);
            $.cookie('isLoggedIn', true);
            //$cookieStore.put('isLoggedIn', {'log': true});
            //console.log('$cookieStore.get("isLoggedIn"): ', $cookieStore.get("isLoggedIn"));
        };

    });
