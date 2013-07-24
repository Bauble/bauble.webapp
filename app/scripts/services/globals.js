'use strict';

angular.module('BaubleApp')
    .factory('globals', function () {

        return {
            apiRoot: 'http://api.bauble.io/api/v1',

            alerts: [],

            addAlert: function(message, type){
                type = type || "success";
                this.alerts.push({ msg: message, type: type});
            },

            getAuthHeader: function() {
                console.log( 'getAuthHeader()' );

                var credentials = sessionStorage.getItem("credentials");
                console.log( "creds: ", credentials);
                return { "Authorization": "Basic " + credentials };
            }
        };
    });
