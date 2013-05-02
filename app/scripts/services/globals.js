'use strict';

angular.module('BaubleApp')
    .factory('globals', function ($cookies) {
        return {
            apiRoot: "http://localhost:8010/api/v1",

            logOut: function() {
                console.log('globals.logOut()');
                $.cookie("isLoggedIn", false);
                //$cookies.isLoggedIn = 'false';
                //$cookies.test = 'false';
                //$cookieStore.put("isLoggedIn", 'false');
            },

            isLoggedIn: function() {
                //return $cookieStore.isLoggedIn;
                return $.cookie("isLoggedIn");
                //return $cookies.test;
                //return $cookieStore.get('isLoggedIn');
            }
        };
    });
