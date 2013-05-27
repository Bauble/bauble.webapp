'use strict';

angular.module('BaubleApp')
  .factory('Auth', function (User) {

      var credentialsKey = "credentials";

      return {
          logIn: function(user, password) {
              // set the temporarily credentials for the request and
              // remove them if the request fails
              sessionStorage.setItem(credentialsKey,
                                     btoa(user + ":" + password));
              console.log( "creds: ", sessionStorage.getItem("credentials") );

              return User.query(user)
                  .success(function(response) {
                      console.log( 'success' );

                  })
                  .error(function(response) {
                      console.log( 'error2' );
                      sessionStorage.removeItem(credentialsKey);
                  });

          },
          logOut: function() {
              sessionStorage.removeItem(credentialsKey);
          },

          isLoggedIn: function() {
              return sessionStorage.getItem(credentialsKey) != null;
          }
      };
  });
