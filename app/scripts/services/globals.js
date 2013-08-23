'use strict';

angular.module('BaubleApp')
    .factory('globals', function () {

        return {
            //apiRoot: 'http://api.bauble.io/api/v1',
            apiRoot: 'http://bretts-mac-mini:9090/api/v1',

            alerts: [],

            addAlert: function(message, type){
                type = type || "success";
                this.alerts.push({ msg: message, type: type});
            },

            getAuthHeader: function() {
                var credentials = sessionStorage.getItem("credentials");
                return { "Authorization": "Basic " + credentials };
            },

            setSelected: function(selected) {
                sessionStorage.setItem("selected", JSON.stringify(selected));
            },

            getSelected: function() {
                return JSON.parse(sessionStorage.getItem('selected'));
            }
        };
    });
