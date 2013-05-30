'use strict';

angular.module('BaubleApp')
    .factory('Auth', function (User) {

        var credentialsKey = "credentials",
            userKey = "user";

        return {
            logIn: function(username, password) {
                // set the temporarily credentials for the request and
                // remove them if the request fails
                sessionStorage.setItem(credentialsKey,
                                       btoa(username + ":" + password));
                User.setDepth(2);
                return User.query(username)
                    .success(function(data, status, headers, config) {
                        var user = data.results[0];
                        sessionStorage.setItem(userKey, JSON.stringify(user));
                    })
                    .error(function(response) {
                        console.log("Could not authorize user: ", username)
                        sessionStorage.removeItem(credentialsKey);
                        sessionStorage.removeItem(userKey);
                    });
            },

            logOut: function() {
                sessionStorage.removeItem(credentialsKey);
            },

            isLoggedIn: function() {
                return sessionStorage.getItem(credentialsKey) &&
                    sessionStorage.getItem(userKey);
            },

            // return the logged in user record
            getUser: function() {
                return JSON.parse(sessionStorage.getItem(userKey)) || null;
            }
        };
    });
