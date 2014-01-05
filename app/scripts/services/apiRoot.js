'use strict';

angular.module('BaubleApp')
    .factory('apiRoot', ['$location', function($location) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        return $location.host() === 'bauble.io' ?
            'http://api.bauble.io/api/v1' : 'http://localhost:9090/api/v1';
    }]);
