'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
// angular.module('BaubleApp.services', [])
//   .value('version', '0.1');

angular.module('BaubleApp.services', ['ngResource'])
    .factory('Search', ['$http', function($http) {
        return function(value, callback) {
            return $http({method: 'GET', url: '/search', params: {'q': value}})
        .then(callback);
    };
    }])

    // Family service for CRUD family types
    .factory('Family', ['$resource', function($resource) {
        return $resource('/family/:familyId', {}, {
            get: {method: 'GET'} //params: {familyId: '999'}}
        });
    }]);


