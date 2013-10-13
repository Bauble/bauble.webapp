'use strict';

angular.module('BaubleApp')
    .factory('Search', function ($http, globals) {

        return {
            query: function(q) {
                var config = {
                    url: globals.apiRoot + "/search",
                    method: 'GET',
                    params: {
                        q: q
                    },
                    headers: angular.extend(globals.getAuthHeader(), {
                        'Accept': 'application/json;depth=1'
                    })
                };
                console.log(config);
                return $http(config);
            }
        };
    });
