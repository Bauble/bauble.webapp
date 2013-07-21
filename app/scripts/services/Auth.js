'use strict';

angular.module('BaubleApp')
    .factory('Auth', function (User) {

        var credentialsKey = "credentials",
            userKey = "user";

        function checkSessionStorage() {
            try {
                var _dummy = window.sessionStorage;
            } catch(e) {
                alert('Could not accession sessionStorage.');
                throw e;
            }
        }

        return {
            logIn: function(username, password) {

                checkSessionStorage();

                // set the temporarily credentials for the request and
                // remove them if the request fails
                sessionStorage.setItem(credentialsKey,
                                       btoa(username + ':' + password));
                return User.query({q: username, depth: 2})
                    .success(function(data) { // , status, headers, config) {
                        var user = data.results[0];
                        sessionStorage.setItem(userKey, JSON.stringify(user));
                    })
                    .error(function() { //response) {
                        console.log("Could not authorize user: ", username);
                        sessionStorage.removeItem(credentialsKey);
                        sessionStorage.removeItem(userKey);
                    });
            },

            logOut: function() {
                checkSessionStorage();
                sessionStorage.removeItem(credentialsKey);
                sessionStorage.removeItem(userKey);
            },

            isLoggedIn: function() {
                checkSessionStorage();
                return sessionStorage.getItem(credentialsKey) &&
                    sessionStorage.getItem(userKey);
            },

            // return the logged in user record
            getUser: function() {
                return JSON.parse(sessionStorage.getItem(userKey)) || null;
            }
        };
    });
