'use strict';

angular.module('BaubleApp')
    .factory('globals', function () {
        return {
            apiRoot: "http://localhost:8010/api/v1",
            selection: null
        };
    });
