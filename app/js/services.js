'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
// angular.module('BaubleApp.services', [])
//   .value('version', '0.1');

angular.module('BaubleApp.services', [])
    .factory('Query', ['$http', function($http) {
        return $http({method: 'GET', url: '/search'}).
                success(function(data, status, headers, config) {
                    console.log('/search success: ', data);
                }).
                error(function(data, status, headers, config) {
                    console.log('/search error: ', data);
                });
    }]);
