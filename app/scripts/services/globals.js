'use strict';

angular.module('BaubleApp')
    .factory('globals', function () {
        return {
            apiRoot: "http://localhost:8080/api/v1"
        };
    });
