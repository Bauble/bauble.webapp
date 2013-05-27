'use strict';

angular.module('BaubleApp')
    .factory('globals', function () {

        return {
            apiRoot: "http://eurystyles:9090/api/v1",

            getAuthHeader: function() {
                console.log( 'getAuthHeader()' );

                var credentials = sessionStorage.getItem("credentials");
                console.log( "creds: ", credentials);
                return { "Authorization": "Basic " + credentials };
            }
        };
    });
